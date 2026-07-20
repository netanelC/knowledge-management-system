# **Home Assignment**

This exercise is designed to simulate the type of work our engineering team performs. We are not looking for a perfect product. Instead, we want to understand how you approach building software, making technical decisions, and delivering a complete solution.

You are encouraged to use AI development tools (ChatGPT, Claude, GitHub Copilot, Cursor, etc.) as part of your workflow. However, you should fully understand the code you submit, as we will discuss your implementation and design decisions during the technical interview. Include a short section in your README describing any AI tools you used during development.

Expected effort: Approx. 5 hours

# **Knowledge Management System**

Your goal is to implement a knowledge system that allows collecting and looking up different pieces of information, specifically text files and images. The system should include the following capabilities:

## File Upload

Ability to upload text or image files to add them to the knowledge system, uploaded assets are available to view using the system.

## Smart Search

Ability to search through the knowledge system to find specific assets, the search should include properties of the assets, for example:

1. Searching for “black hair” will find images containing black hair or text files that include the text **or reference it** .

2. Searching for “document” will find images that contain documents in them, as well as text files that contain or reference the term.

When content is uploaded, your system should use an AI service to generate searchable metadata for the asset (for example descriptions, tags, or keywords). The generated metadata should be stored and used to power search.

## Production System

Your solution should be uploaded to git and deployed as a containerized application available online, you’re free to choose the cloud environment that fits your needs and knowledge. This assignment is intended to demonstrate engineering approach rather than production readiness. You do not need to implement authentication, authorization, scalability, or production-grade security.

# **Delivery**

When completed, send the recruiter a link to your github repository and a link to the deployed system, we’ll follow up scheduling a technical interview. If you have any technical questions regarding the assignment you can contact the hiring manager.
