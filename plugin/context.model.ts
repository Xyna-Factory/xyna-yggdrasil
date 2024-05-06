/*
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Copyright 2024 Xyna GmbH, Germany
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
import { XoObjectClass, XoArrayClass, XoProperty, XoObject, XoArray, XoXPRCRuntimeContext } from '@zeta/api';


@XoObjectClass(null, 'xmcp.yggdrasil.plugin', 'Context')
export class XoContext extends XoObject {


    @XoProperty()
    fQN: string;


    @XoProperty()
    location: string;


    @XoProperty()
    objectId: string;


    @XoProperty(XoXPRCRuntimeContext)
    runtimeContext: XoXPRCRuntimeContext = new XoXPRCRuntimeContext();


}

@XoArrayClass(XoContext)
export class XoContextArray extends XoArray<XoContext> {
}