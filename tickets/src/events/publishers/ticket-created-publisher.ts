import {Publisher, Subjects, TicketCreatedEvent} from "@microtickets_mh/common"




export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}