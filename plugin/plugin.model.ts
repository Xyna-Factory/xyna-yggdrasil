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
import { XoArray, XoArrayClass, XoObjectClass, XoProperty } from '@zeta/api';

import { XoGuiDefiningWorkflowArray } from './gui-defining-workflow.model';
import { XoPluginBase } from './plugin-base.model';


@XoObjectClass(XoPluginBase, 'xmcp.yggdrasil.plugin', 'Plugin')
export class XoPlugin extends XoPluginBase {


    @XoProperty(XoGuiDefiningWorkflowArray)
    guiDefiningWorkflow: XoGuiDefiningWorkflowArray = new XoGuiDefiningWorkflowArray();


}

@XoArrayClass(XoPlugin)
export class XoPluginArray extends XoArray<XoPlugin> {
}
