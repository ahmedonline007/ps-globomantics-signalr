const initializeSignalRConnection = () => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/auctionhub")
        //.withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol())//لتشفير البيانات بين الكلاينت والباك اند ولكن عند ارسال بارامتر لابد من ان اول حرف capital
        .build();

    //لاشعار جميع المستخدمين
    connection.on("ReceiveNewBid", ({ auctionId, newBid }) => {
        const tr = document.getElementById(auctionId + "-tr");
        const input = document.getElementById(auctionId + "-input");
        //start animation
        tr.classList.add("animate-highlight");
        setTimeout(() => tr.classList.remove("animate-highlight"), 2000);
        const bidText = document.getElementById(auctionId + "-bidtext");
        bidText.innerText = newBid;
        input.value = newBid + 1;
    });

    //connection.on("ReceiveNewBid", ({ AuctionId, NewBid }) => {
    //    const tr = document.getElementById(auctionId + "-tr");
    //    const input = document.getElementById(auctionId + "-input");
    //    //start animation
    //    setTimeout(() => tr.classList.add("animate-highlight"), 20);
    //    setTimeout(() => tr.classList.remove("animate-highlight"), 2000);

    //    const bidText = document.getElementById(AuctionId + "-bidtext");
    //    bidText.innerHTML = NewBid;
    //    input.value = NewBid + 1;
    //});

    //لاشعار مستخدم المتصل فقط
    connection.on("ConfirmNewBid", ({ AuctionId, NewBid }) => {
        const tr = document.getElementById(AuctionId + "-tr");
        const input = document.getElementById(AuctionId + "-input");
        //start animation
        tr.classList.add("animate-highlight");
        setTimeout(() => tr.classList.remove("animate-highlight"), 2000);
        const bidText = document.getElementById(AuctionId + "-bidtext");
        bidText.innerText = NewBid;
        input.value = NewBid + 1;
    });
    //لاشعار جميع المستخدمين عند اضاقة مزايدة جديدة
    connection.on("ReceiveNewAuction", ({ Id, ItemName, CurrentBid }) => {
        var tbody = document.querySelector("#table>tbody");
        tbody.innerHTML += `<tr id="${Id}-tr" class="align-middle">
                                <td>${ItemName}</td >
                                <td id="${id}-bidtext" class="bid">${CurrentBid}</td >
                                <td class="bid-form-td">
                                    <input id="${Id}-input" class="bid-input" type="number" value="${CurrentBid + 1}" />
                                    <button class="btn btn-primary" type="button" onclick="submitBid(${Id})">Bid</button>
                                </td>
                            </tr>`;
    });

    connection.on("NotifyOutbid", ({ AuctionId }) => {
        const tr = document.getElementById(AuctionId + "-tr");
        if (!tr.classList.contains("outbid"))
            tr.classList.add("outbid");
    });

    connection.start().catch(err => console.error(err.toString()));
    return connection;
};
const connection = initializeSignalRConnection();

const submitBid = (auctionId) => {
    const tr = document.getElementById(auctionId + "-tr");
    tr.classList.remove("outbid");
    const bid = document.getElementById(auctionId + "-input").value;
    fetch("/auction/" + auctionId + "/newbid?currentBid=" + bid, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (connection.state !== signalR.HubConnectionState.Connected)
        location.reload();
    connection.invoke("NotifyNewBid", { auctionId: parseInt(auctionId), newBid: parseInt(bid) });
}

const submitAuction = () => {
    const itemName = document.getElementById("add-itemname").value;
    const currentBid = document.getElementById("add-currentbid").value;
    fetch("/auction", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemName, currentBid })
    });

   // connection.invoke("NotifyNewBid", { auctionId: 55, newBid: 55 });
}