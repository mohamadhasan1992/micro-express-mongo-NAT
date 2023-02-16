import {Subjects, ExpirationCompleteEvent, Publisher} from "@microtickets_mh/common"


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}