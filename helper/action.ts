// // Function to get guild members and format them as choices
// async function getGuildMemberChoices(guild) {
//    const members = await guild.members.fetch();
//    return members.map(member => ({
//        name: member.user.username,
//        value: member.user.id
//    })).slice(0, 25); // Discord limits choices to 25
// }
