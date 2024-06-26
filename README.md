# Welcome to the Magical World of Harry Potter!

Welcome to our enchanting web application, where you can explore the fascinating world of Harry Potter, including potions, spells, and quotes from your favorite characters. Here's a quick overview of what you'll find and how to use our platform:

## Overview

1. **Home Page:** Upon entering the site, you'll land on the Home Page, where you'll find instructions on navigating through the different sections of the application.

2. **Book of Admittance:** Dive into the Book of Admittance to explore detailed profiles of all Hogwarts students, sorted into Gryffindor, Slytherin, Ravenclaw, and Hufflepuff houses.

3. **O.W.L.S Page:** Test your wizarding knowledge with our O.W.L.S page. Answer questions about potions, spells, and chapter quotes from your favorite characters to earn coins for use in Diagon Alley.

4. **Diagon Alley:** Welcome to Diagon Alley! Use your coins from the O.W.L.S quiz to shop for potions. Even if you didn't win any coins, you'll still receive 100 just for using our app. There’s a bar to the right that indicates the available balance for your shopping.

## How to Use

1. Clone the repository to your local machine.
2. Run the `server.js` file using the command `node server.js`.
3. Access the application in your browser at [http://localhost:3000/home](http://localhost:3000/home).
4. Navigate through the different pages using the navigation bar at the top.

## Modules to Install

1. Express- npm install express
2. EJS- npm install ejs

## Features Implemented

- **Pagination:** Efficiently display potions data on the Diagon Alley page with pagination, providing smoother navigation through potion listings.
  
- **Caching:** Implement caching on the Diagon Alley page to retrieve previous page data efficiently, reducing the need for repeated API calls and enhancing performance.
  
- **Recommendation Engine:** Enhance the application with a recommendation engine, suggesting potions based on the ingredients of previously purchased potions, providing a personalized browsing experience.
  
- **Print-friendly Styles:** Optimize the layout of the potions page with print-friendly styles, presenting potion details in a concise card format suitable for printing, excluding potion images for better readability.
  
- **Animations:** Add animations throughout the web application to enhance user engagement and provide a delightful and interactive experience.
  
- **Responsive Design:** Ensure optimal viewing on mobile and tablet devices with responsive design, offering a seamless user experience across different screen sizes.
  
- **Lazy Loading:** Implement lazy loading in the Book of Admittance page to efficiently load the list of students along with their images and details, enhancing performance and user experience.

- **JEST:** Written JEST test for verifying the recommendation login if it’s giving correct results or not. 

