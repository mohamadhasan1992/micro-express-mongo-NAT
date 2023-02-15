import {Publisher, Subjects , TicketUpdatedEvent} from "@microtickets_mh/common"


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}