document.addEventListener('DOMContentLoaded', () => {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const feedbackFormSection = document.getElementById('feedbackFormSection');
    const feedbackForm = document.getElementById('feedbackForm');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const feedbackSummary = document.getElementById('feedbackSummary');
    const summaryAssociateName = document.getElementById('summaryAssociateName');
    const searchResults = document.getElementById('searchResults');
    const detailView = document.getElementById('detailView');
    const detailTableBody = document.querySelector('#detailTable tbody');
    const backToMainButton = document.getElementById('backToMainButton');
    const backToSummaryButton = document.getElementById('backToSummaryButton');
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    const menu = document.getElementById('menu');
    const flFeedbacksOverview = document.getElementById('flFeedbacksOverview');
    const flOverviewSection = document.getElementById('flOverviewSection');
    const flOverviewBody = document.getElementById('flOverviewBody');
    const flDetailView = document.getElementById('flDetailView');
    const flDetailTableBody = document.getElementById('flDetailTableBody');
    const backToMainFromOverviewButton = document.getElementById('backToMainFromOverviewButton');
    const backToOverviewButton = document.getElementById('backToOverviewButton');

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const dateOfCoaching = document.getElementById('dateOfCoaching').value;
        const flSubmitted = document.getElementById('flSubmitted').value.trim();
        const topicBulletPoint = document.getElementById('topicBulletPoint').value;
        const associateName = document.getElementById('associateName').value.trim();
        const feedbackText = document.getElementById('feedbackText').value.trim();

        if (!dateOfCoaching || !flSubmitted || !topicBulletPoint || !associateName || !feedbackText) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        const feedback = {
            date: new Date().toISOString().slice(0, 10),
            flSubmitted: flSubmitted,
            topic: topicBulletPoint,
            associateName: associateName,
            feedback: feedbackText
        };
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        feedbackForm.reset();
        alert('Feedback submitted successfully!');
    });

    searchBar.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();  // Prevent the form from submitting on Enter
            searchButton.click();
        }
    });

    searchButton.addEventListener('click', () => {
        const name = searchBar.value.trim().toLowerCase();
        if (name) {
            displayFeedbackSummary(name);
            searchResults.style.display = 'block';
            feedbackFormSection.style.display = 'none';
            flOverviewSection.style.display = 'none';
        } else {
            alert('Please enter an associate user ID.');
        }
    });

    function displayFeedbackSummary(searchName) {
        let displayName = searchName.charAt(0).toUpperCase() + searchName.slice(1);
        summaryAssociateName.textContent = displayName;
        feedbackSummary.innerHTML = '';
        let topics = {};

        feedbacks.filter(f => f.associateName.toLowerCase().startsWith(searchName))
                 .forEach(f => {
                     if (!topics[f.topic]) {
                         topics[f.topic] = [];
                     }
                     topics[f.topic].push(f);
                 });

        for (let topic in topics) {
            let row = feedbackSummary.insertRow();
            let topicCell = row.insertCell(0);
            let button = document.createElement('button');
            button.textContent = topic;
            button.onclick = () => displayDetails(topics[topic]);
            button.style.cursor = 'pointer';  // Make the cursor a pointer to indicate it's clickable
            topicCell.appendChild(button);
            row.insertCell(1).textContent = topics[topic].length;
        }
    }

    function displayDetails(topicFeedbacks) {
        detailTableBody.innerHTML = '';
        topicFeedbacks.forEach(f => {
            let row = detailTableBody.insertRow();
            row.insertCell(0).textContent = f.date;
            row.insertCell(1).textContent = f.topic;
            row.insertCell(2).textContent = f.feedback;
            row.insertCell(3).textContent = f.flSubmitted;
            row.insertCell(4).textContent = f.associateName;
        });
        detailView.style.display = 'block';
        searchResults.style.display = 'none';
    }

    backToMainButton.addEventListener('click', () => {
        feedbackFormSection.style.display = 'block';
        searchResults.style.display = 'none';
        detailView.style.display = 'none';  // Ensure detail view is also hidden
        flOverviewSection.style.display = 'none';
    });

    backToSummaryButton.addEventListener('click', () => {
        detailView.style.display = 'none';
        searchResults.style.display = 'block';
    });

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('open');
        menuOverlay.style.display = menu.classList.contains('open') ? 'block' : 'none';
    });

    menuOverlay.addEventListener('click', () => {
        menu.classList.remove('open');
        menuOverlay.style.display = 'none';
    });

    flFeedbacksOverview.addEventListener('click', (event) => {
        event.preventDefault();
        displayFLFeedbacksOverview();
        flOverviewSection.style.display = 'block';
        feedbackFormSection.style.display = 'none';
        searchResults.style.display = 'none';
        detailView.style.display = 'none';
        menu.classList.remove('open');
        menuOverlay.style.display = 'none';
    });

    function displayFLFeedbacksOverview() {
        flOverviewBody.innerHTML = '';
        let flFeedbacks = {};

        feedbacks.forEach(f => {
            const flName = f.flSubmitted.toLowerCase();
            if (!flFeedbacks[flName]) {
                flFeedbacks[flName] = { name: f.flSubmitted, count: 0 };
            }
            flFeedbacks[flName].count++;
        });

        for (let fl in flFeedbacks) {
            let row = flOverviewBody.insertRow();
            let flCell = row.insertCell(0);
            let button = document.createElement('button');
            button.textContent = flFeedbacks[fl].name;
            button.onclick = () => displayFLDetails(feedbacks.filter(f => f.flSubmitted.toLowerCase() === fl));
            button.style.cursor = 'pointer';  // Make the cursor a pointer to indicate it's clickable
            flCell.appendChild(button);
            row.insertCell(1).textContent = flFeedbacks[fl].count;
        }
    }

    function displayFLDetails(flFeedbacks) {
        flDetailTableBody.innerHTML = '';
        flFeedbacks.forEach(f => {
            let row = flDetailTableBody.insertRow();
            row.insertCell(0).textContent = f.date;
            row.insertCell(1).textContent = f.topic;
            row.insertCell(2).textContent = f.feedback;
            row.insertCell(3).textContent = f.flSubmitted;
            row.insertCell(4).textContent = f.associateName;
        });
        flDetailView.style.display = 'block';
        flOverviewSection.style.display = 'none';
    }

    backToMainFromOverviewButton.addEventListener('click', () => {
        flOverviewSection.style.display = 'none';
        feedbackFormSection.style.display = 'block';
    });

    backToOverviewButton.addEventListener('click', () => {
        flDetailView.style.display = 'none';
        flOverviewSection.style.display = 'block';
    });
});
