/*
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Copyright 2022 GIP SmartMercial GmbH, Germany
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { XoJson } from '@zeta/api';

import { FullQualifiedName, RuntimeContext } from '@zeta/api/xo/xo-describer';
import { AuthService } from '@zeta/auth';
import { randomUUID } from '@zeta/base';

import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { XoDeploymentItemChange } from './xo/deployment-item-change.model';
import { XoDocumentChange } from './xo/document-change.model';
import { XoDocumentLock } from './xo/document-lock.model';
import { XoDocumentRelationsChange } from './xo/document-relations-change.model';
import { XoDocumentUnlock } from './xo/document-unlock.model';
import { XoEvent } from './xo/event.model';
import { XoGetEventsResponse } from './xo/get-events-response.model';
import { XoOISChange } from './xo/ois-change.model';
import { XoRemoteDestinationsChange } from './xo/remote-destinations-change.model';
import { XoStructureChange } from './xo/structure-change.model';
import { XoSubtypesChange } from './xo/subtypes-change.model';
import { XoXMOMChangedRTCDependencies } from './xo/xmom-changed-rtc-dependencies.model';
import { XoXMOMCreateRTC } from './xo/xmom-create-rtc.model';
import { XoXMOMDeleteRTC } from './xo/xmom-delete-rtc.model';
import { XoXMOMDelete } from './xo/xmom-delete.model';
import { XoXMOMSave } from './xo/xmom-save.model';


/**
 * Structure to cluster XMOM changes with same paths
 *
 * * saved.under.path1.WF1
 * * saved.under.path1.DT1
 * * saved.under.path2.DT2
 *
 * shall result in paths [saved.under.path1, saved.under.path2]
 */
export class XMOMChangeBundle {
    private readonly _saves: XoXMOMSave[] = [];
    private readonly _deletes: XoXMOMDelete[] = [];
    private readonly _paths = new Set<string>();
    private readonly _creators = new Set<string>();


    get saves(): XoXMOMSave[] {
        return this._saves;
    }

    addSave(xmomSave: XoXMOMSave) {
        this._saves.push(xmomSave);
        this.updatePaths(xmomSave.$fqn);
        this._creators.add(xmomSave.creator);
    }

    get deletes(): XoXMOMDelete[] {
        return this._deletes;
    }

    addDelete(xmomDelete: XoXMOMDelete) {
        this._deletes.push(xmomDelete);
        this.updatePaths(xmomDelete.$fqn);
        this._creators.add(xmomDelete.creator);
    }

    get paths(): Set<string> {
        return this._paths;
    }

    updatePaths(fqn: string) {
        this._paths.add(FullQualifiedName.decode(fqn).path);
    }

    hasData(): boolean {
        return this._saves.length > 0 || this._deletes.length > 0;
    }

    get creators(): Set<string> {
        return this._creators;
    }
}


@Injectable()
export class MessageBusService {

    private running = false;
    private readonly id: string = randomUUID();

    private readonly remoteDestinationsChangeSubject = new Subject<XoRemoteDestinationsChange>();
    get remoteDestinationsChange(): Observable<XoRemoteDestinationsChange> { return this.remoteDestinationsChangeSubject.asObservable(); }

    private readonly deploymentItemChangeSubject = new Subject<XoDeploymentItemChange>();
    get deploymentItemChange(): Observable<XoDeploymentItemChange> { return this.deploymentItemChangeSubject.asObservable(); }

    private readonly structureChangeSubject = new Subject<XoStructureChange>();
    get structureChange(): Observable<XoStructureChange> { return this.structureChangeSubject.asObservable(); }

    private readonly subtypesChangeSubject = new Subject<XoSubtypesChange>();
    get subtypesChange(): Observable<XoSubtypesChange> { return this.subtypesChangeSubject.asObservable(); }

    /** Remark: Not supported yet (see YG-2) */
    private readonly oisChangeSubject = new Subject<XoOISChange>();
    get oisChange(): Observable<XoOISChange> { return this.oisChangeSubject.asObservable(); }

    private readonly documentLockSubject = new Subject<XoDocumentLock>();
    get documentLock(): Observable<XoDocumentLock> { return this.documentLockSubject.asObservable(); }

    private readonly documentUnlockSubject = new Subject<XoDocumentUnlock>();
    get documentUnlock(): Observable<XoDocumentUnlock> { return this.documentUnlockSubject.asObservable(); }

    private readonly documentChangeSubject = new Subject<XoDocumentChange>();
    get documentChange(): Observable<XoDocumentChange> { return this.documentChangeSubject.asObservable(); }

    private readonly documentRelationsChangeSubject = new Subject<XoDocumentRelationsChange>();
    get documentRelationsChange(): Observable<XoDocumentRelationsChange> { return this.documentRelationsChangeSubject.asObservable(); }

    private readonly xmomSaveSubject = new Subject<XoXMOMSave>();
    get xmomSave(): Observable<XoXMOMSave> { return this.xmomSaveSubject.asObservable(); }

    private readonly xmomDeleteSubject = new Subject<XoXMOMDelete>();
    get xmomDelete(): Observable<XoXMOMDelete> { return this.xmomDeleteSubject.asObservable(); }

    private readonly xmomCreateRTCSubject = new Subject<XoXMOMCreateRTC>();
    get xmomCreateRTC(): Observable<XoXMOMCreateRTC> { return this.xmomCreateRTCSubject.asObservable(); }

    private readonly xmomDeleteRTCSubject = new Subject<XoXMOMDeleteRTC>();
    get xmomDeleteRTC(): Observable<XoXMOMDeleteRTC> { return this.xmomDeleteRTCSubject.asObservable(); }

    private readonly xmomChangedRTCDependenciesSubject = new Subject<XoXMOMChangedRTCDependencies>();
    get xmomChangedRTCDependencies(): Observable<XoXMOMChangedRTCDependencies> { return this.xmomChangedRTCDependenciesSubject.asObservable(); }

    private readonly xmomChangeSubject = new Subject<XMOMChangeBundle>();
    get xmomChange(): Observable<XMOMChangeBundle> { return this.xmomChangeSubject.asObservable(); }


    constructor(private readonly http: HttpClient, private readonly auth: AuthService) {
    }


    startUpdates() {
        if (!this.running) {
            this.running = true;
            this.requestEvents();
        } else {
            console.warn('Multiuser requests are already running.');
        }
    }


    stopUpdates() {
        this.running = false;
    }


    protected requestEvents() {
        const url = 'runtimeContext/' + RuntimeContext.guiHttpApplication.uniqueKey + '/events/' + this.id;

        return this.http.get(url).pipe(
            catchError(error => of(null))
        ).subscribe((responseJSON: XoJson) => {
            // continue with multi user requests (in error case, defer next request)
            if (this.running) {
                const delay = responseJSON ? 0 : 10 * 1000;
                setTimeout(() => {
                    this.requestEvents();
                }, delay);
            }

            const response = new XoGetEventsResponse().decode(responseJSON);
            if (response?.updates?.length > 0) {
                this.handleEvents(response.updates.data.filter(e => !e.ignoreSelfInvoked || e.creator !== this.auth.username));
            }
        });
    }


    protected handleEvents(events: XoEvent[]) {
        const xmomChangeBundle = new XMOMChangeBundle();
        events.forEach(e => {
            if (e instanceof XoRemoteDestinationsChange) {
                this.remoteDestinationsChangeSubject.next(e);
            } else if (e instanceof XoDeploymentItemChange) {
                this.deploymentItemChangeSubject.next(e);
            } else if (e instanceof XoStructureChange) {
                this.structureChangeSubject.next(e);
            } else if (e instanceof XoSubtypesChange) {
                this.subtypesChangeSubject.next(e);
            } else if (e instanceof XoOISChange) {
                this.oisChangeSubject.next(e);
            } else if (e instanceof XoDocumentLock) {
                this.documentLockSubject.next(e);
            } else if (e instanceof XoDocumentUnlock) {
                this.documentUnlockSubject.next(e);
            } else if (e instanceof XoDocumentChange) {
                this.documentChangeSubject.next(e);
            } else if (e instanceof XoDocumentRelationsChange) {
                this.documentRelationsChangeSubject.next(e);
            } else if (e instanceof XoXMOMSave) {
                this.xmomSaveSubject.next(e);
                xmomChangeBundle.addSave(e);
            } else if (e instanceof XoXMOMDelete) {
                this.xmomDeleteSubject.next(e);
                xmomChangeBundle.addDelete(e);
            } else if (e instanceof XoXMOMCreateRTC) {
                this.xmomCreateRTCSubject.next(e);
            } else if (e instanceof XoXMOMDeleteRTC) {
                this.xmomDeleteRTCSubject.next(e);
            } else if (e instanceof XoXMOMChangedRTCDependencies) {
                this.xmomChangedRTCDependenciesSubject.next(e);
            }
        });
        if (xmomChangeBundle.hasData()) {
            this.xmomChangeSubject.next(xmomChangeBundle);
        }
    }
}
