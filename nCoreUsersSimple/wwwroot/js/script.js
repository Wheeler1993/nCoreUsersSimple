let viewModel;

function InitKnockout() {
    viewModel = { users: ko.observableArray(), sortedUsers: ko.observableArray() }
    ko.applyBindings(viewModel);
}

//maxuserId: 1640305
//chrome path: C:\Program Files (x86)\Google\Chrome\Application
//chrome low security mode command: chrome.exe --disable-web-security --user-data-dir=C:\Users\Richárd\AppData\Local\Google\Chrome

async function LoadUsers() {
    for (let userId = 1100; userId <= 1400; userId++) {
        $.get({ url: "https://ncore.cc/profile.php?id=" + userId }).done((page) => {
            let pageObject = $($.parseHTML(page)[29]);
            let userName = $(pageObject.find("#profil_nev").children()[0]).text();
            let regDate = $(pageObject.find(".profil_jobb_masodik2")[0]).text();
            let rank = $(pageObject.find(".profil_jobb_masodik2")[2]).text();
            let uploadedElement = $($(pageObject.find(".profil_jobb_masodik2")[3]).children()[0]);
            let uploaded = uploadedElement.text();
            let uploadedInBytes = uploadedElement.attr('title').replace("bájt", "").replace(/\s/g, "");
            viewModel.users.push({ userId: userId, name: userName, regDate: regDate, rank: rank, uploaded: uploaded, uploadedInBytes: uploadedInBytes });
            viewModel.sortedUsers((sortUsers()));
        });
        await new Promise(r => setTimeout(r, 2000));
    }
}

function sortUsers() {
    return viewModel.users.sorted(function (leftUser, rightUser) {
        let left = parseInt(leftUser.uploadedInBytes);
        let right = parseInt(rightUser.uploadedInBytes);
        return left === right ? 0
            : left < right ? 1
                : -1;
    });
}