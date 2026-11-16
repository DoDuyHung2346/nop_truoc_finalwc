import { z } from 'zod';

export const DEVICE_STATUSES = ['AVAILABLE','BORROWED','MAINTENANCE'] as const;
export const REQUEST_STATUSES = ['PENDING','APPROVED','BORROWING','RETURNED','REJECTED'] as const;
export type DeviceStatus = typeof DEVICE_STATUSES[number];
export type RequestStatus = typeof REQUEST_STATUSES[number];
export const deviceStatusLabel: Record<DeviceStatus,string> = { AVAILABLE:'Sẵn sàng', BORROWED:'Đang mượn', MAINTENANCE:'Bảo trì' };
export const requestStatusLabel: Record<RequestStatus,string> = { PENDING:'Chờ duyệt', APPROVED:'Đã duyệt', BORROWING:'Đang mượn', RETURNED:'Đã trả', REJECTED:'Từ chối' };
export const transitions: Record<RequestStatus, RequestStatus[]> = { PENDING:['APPROVED','REJECTED'], APPROVED:['PENDING','BORROWING','REJECTED'], BORROWING:['RETURNED'], RETURNED:[], REJECTED:['PENDING'] };
export const canTransition = (from: RequestStatus, to: RequestStatus) => transitions[from].includes(to);
export const rangesOverlap = (aStart:string,aEnd:string,bStart:string,bEnd:string) => aStart <= bEnd && bStart <= aEnd;
export function normalizeText(s:string) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim(); }
export function matchesQuery(fields:string[], q:string) { const n=normalizeText(q); const compact=n.replace(/\s/g,''); return !n || fields.some(f=>{const v=normalizeText(f);return v.includes(n)||v.replace(/\s/g,'').includes(compact)}); }
export function isValidIsoDate(value:string) { if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false; const [y,m,d]=value.split('-').map(Number); const x=new Date(y,m-1,d); return x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d; }
export function formatDate(value:string) { const [y,m,d]=value.slice(0,10).split('-'); return `${d}/${m}/${y}`; }
const date = (required:string, invalid:string) => z.string({required_error:required}).refine(isValidIsoDate,invalid);
export const createRequestSchema = z.object({ deviceCode:z.string().min(1,'Vui lòng chọn thiết bị.'), borrowerName:z.string().transform(v=>v.trim().replace(/\s+/g,' ')).refine(v=>v.length>0,'Vui lòng nhập họ tên người mượn.').refine(v=>v.length>=2&&v.length<=60,'Họ tên cần từ 2 đến 60 ký tự.'), borrowDate:date('Vui lòng chọn ngày mượn.','Ngày mượn không hợp lệ.'), returnDate:date('Vui lòng chọn ngày trả dự kiến.','Ngày trả dự kiến không hợp lệ.'), purpose:z.string().max(300,'Mục đích không quá 300 ký tự.').optional().nullable() }).superRefine((v,c)=>{if(v.returnDate<v.borrowDate)c.addIssue({code:z.ZodIssueCode.custom,path:['returnDate'],message:'Ngày trả dự kiến không được trước ngày mượn.'})});
export const changeStatusSchema = z.object({status:z.enum(REQUEST_STATUSES),note:z.string().max(200,'Ghi chú không quá 200 ký tự.').optional()});
export type Device = {code:string;name:string;type:string;status:DeviceStatus;note:string;createdAt:string;updatedAt:string};
export type BorrowRequest = {code:string;deviceCode:string;deviceName:string;deviceType:string;borrowerName:string;borrowDate:string;returnDate:string;status:RequestStatus;purpose:string|null;managerNote:string|null;returnedAt:string|null;createdAt:string;updatedAt:string;overlap?:{blocking:string[];competing:string[]}};
