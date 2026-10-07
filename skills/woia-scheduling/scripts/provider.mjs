import {guard,requireValue as need,once,finish} from './guard.mjs';
export const ACTIONS=['appointment.availability.read','appointment.read','appointment.create','appointment.reschedule','appointment.cancel','appointment.status.observe'];
export const initialState=()=>({schema:'dev.woia.appointment-state/v1',appointments:[],operations:[],history:[]});
export function transition(input,command,context){
 guard(command,context,ACTIONS);need(['customer-service','sales','leasing','property-management','operations'].includes(context.department),'CONSUMER_NOT_ELIGIBLE');
 const state=structuredClone(input);const repeated=once(state,command);if(repeated)return {state,result:repeated};const {action,organization,payload:p}=command;need(p,'PAYLOAD_REQUIRED');
 if(action==='appointment.availability.read'){need(context.availability?.current===true&&context.availability.resource===command.resource,'CURRENT_AVAILABILITY_REQUIRED');return {state,result:structuredClone(context.availability.slots)};}
 need(p.appointment_id,'APPOINTMENT_ID_REQUIRED');let a=state.appointments.find(x=>x.organization===organization&&x.id===p.appointment_id);
 if(action==='appointment.read'){need(a&&a.resource===command.resource,'APPOINTMENT_NOT_FOUND');return {state,result:structuredClone(a)};}
 if(action==='appointment.status.observe'){
  need(a&&a.resource===command.resource&&context.adapter_verified===true&&p.source_ref,'VERIFIED_STATUS_REQUIRED');need(p.expected_version===a.version,'VERSION_CONFLICT');
  need(['booking','confirmation','attendance'].includes(p.kind),'DISTINCT_STATUS_KIND_REQUIRED');const allowed={booking:['booked','cancelled'],confirmation:['unknown','confirmed','declined'],attendance:['unknown','attended','not-attended']};need(allowed[p.kind].includes(p.status),'INVALID_APPOINTMENT_STATUS');need(p.kind!=='booking','BOOKING_MUTATION_CUSTOMER_SERVICE_ONLY');
  a[p.kind]=p.status;a.version++;a.observations.push({kind:p.kind,status:p.status,source_ref:p.source_ref});return finish(state,command,{id:a.id,version:a.version});
 }
 need(context.department==='customer-service','CUSTOMER_SERVICE_MUTATION_ONLY');need(p.notify_external===false,'EXTERNAL_NOTIFICATION_BYPASS_FORBIDDEN');
 if(action==='appointment.create'||action==='appointment.reschedule'){
  need(p.start&&p.end&&Number.isFinite(Date.parse(p.start))&&Date.parse(p.end)>Date.parse(p.start),'VALID_TIME_RANGE_REQUIRED');need(p.timezone&&p.participant_ids?.length&&p.source_ref,'APPOINTMENT_SCOPE_REQUIRED');
  const availability=context.availability;need(availability?.current===true&&availability.resource===command.resource&&availability.slots.some(s=>s.start===p.start&&s.end===p.end),'CURRENT_AVAILABILITY_REQUIRED');
  need(!state.appointments.some(x=>x.organization===organization&&x.resource===command.resource&&x.id!==p.appointment_id&&x.booking==='booked'&&Date.parse(x.start)<Date.parse(p.end)&&Date.parse(p.start)<Date.parse(x.end)),'APPOINTMENT_CONFLICT');
 }
 if(action==='appointment.create'){need(!a,'DUPLICATE_APPOINTMENT');a={id:p.appointment_id,organization,resource:command.resource,start:p.start,end:p.end,timezone:p.timezone,participant_ids:p.participant_ids,source_ref:p.source_ref,booking:'booked',confirmation:'unknown',attendance:'unknown',version:1,observations:[]};state.appointments.push(a);}
 else {need(a&&a.resource===command.resource&&a.booking==='booked','ACTIVE_APPOINTMENT_REQUIRED');need(p.expected_version===a.version,'VERSION_CONFLICT');if(action==='appointment.cancel'){need(p.reason,'CANCELLATION_REASON_REQUIRED');a.booking='cancelled';a.cancel_reason=p.reason;}else{need(a.attendance==='unknown','OBSERVED_ATTENDANCE_IMMUTABLE');a.start=p.start;a.end=p.end;a.timezone=p.timezone;a.participant_ids=p.participant_ids;a.confirmation='unknown';}a.version++;}
 return finish(state,command,{id:a.id,version:a.version,booking:a.booking,notification:'ROUTE_SEPARATELY_VIA_CUSTOMER_SERVICE_COMMUNICATIONS'});
}
