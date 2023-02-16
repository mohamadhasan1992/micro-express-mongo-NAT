import { Ticket } from "../ticket";


it('implements optimistic concurrency control', async() => {
    // create an instance of ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123456'
    });
    await ticket.save();
    // fetch ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    // make two seprate updates
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 50});
    // save the first fetch
    await firstInstance!.save();
    // save the second fetch 

    try{
        await secondInstance!.save();
    }catch(err){
        return
    }
    throw new Error('should not reach this error');
})


it('increments version on mutiple update', async() => {
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        userId: '123456'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

})