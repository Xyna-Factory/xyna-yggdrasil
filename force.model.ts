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
import { XoObjectClass, XoArrayClass, XoObject, XoArray, XoProperty } from '@zeta/api';



@XoObjectClass(null, 'xmcp.yggdrasil', 'Force')
export class XoForce extends XoObject {

    @XoProperty()
    force: boolean;

    static withForce(force = true): XoForce {
        const result = new XoForce();
        result.force = force;
        return result;
    }
}

@XoArrayClass(XoForce)
export class XoForceArray extends XoArray<XoForce> {
}
