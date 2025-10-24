using Microsoft.AspNetCore.SignalR;
using ps_globomantics_signalr.Models;

namespace ps_globomantics_signalr.Hubs
{
    public class AuctionHub : Hub
    {
        public async Task NotifyNewBid(AuctionNotify auctionNotify)
        {
            var groupName = $"auction-{auctionNotify.AuctionId}";

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.OthersInGroup(groupName).SendAsync("NotifyOutbid", auctionNotify);

            await Clients.All.SendAsync("ReceiveNewBid", auctionNotify);

            //await Clients.All.SendAsync("ReceiveNewBid", auctionNotify);
            //await Clients.Caller.SendAsync("ConfirmNewBid");
        }
    }
}