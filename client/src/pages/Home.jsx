import React from "react";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-10 shadow-md rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome to Time Tracking and Data Management
        </h2>
        <p className="text-center text-lg text-gray-700 dark:text-gray-300">
          Manage your time efficiently and track your data effectively with our
          comprehensive solution.
        </p>
        <div className="flex justify-center">
          <img
            src="https://www.freshbooks.com/wp-content/uploads/2022/03/tracking-time.jpg"
            alt="Tracking Time"
            className="w-3/4 rounded-lg shadow-lg"
          />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Key Features:
          </h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-4">
            <li>Track time spent on different tasks and projects.</li>
            <li>Generate detailed reports and statistics.</li>
            <li>Monitor and analyze productivity and efficiency.</li>
            <li>Seamlessly integrate with your existing workflows.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
