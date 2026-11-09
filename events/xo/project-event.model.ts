// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { XoArray, XoArrayClass, XoObjectClass } from '@zeta/api';

import { XoEvent } from './event.model';


@XoObjectClass(XoEvent, 'xmcp.yggdrasil', 'ProjectEvent')
export class XoProjectEvent extends XoEvent {





}

@XoArrayClass(XoProjectEvent)
export class XoProjectEventArray extends XoArray<XoProjectEvent> {
}
