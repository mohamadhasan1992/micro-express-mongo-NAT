import { Publisher, Subjects, OrderCancelledEvent } from "@microtickets_mh/common";



export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}