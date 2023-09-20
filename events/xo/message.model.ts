/*
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Copyright 2023 Xyna GmbH, Germany
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
import { XoProjectEvent } from '@yggdrasil/events/xo/project-event.model';
import { XoArray, XoArrayClass, XoObject, XoObjectClass, XoProperty } from '@zeta/api';


@XoObjectClass(null, 'xmcp.yggdrasil', 'Message')
export class XoMessage extends XoObject {


    @XoProperty()
    context: string;


    @XoProperty()
    correlation: string;


    @XoProperty(XoProjectEvent)
    event: XoProjectEvent = new XoProjectEvent();


    @XoProperty()
    persistent: boolean;


    @XoProperty()
    product: string;


}

@XoArrayClass(XoMessage)
export class XoMessageArray extends XoArray<XoMessage> {
}
