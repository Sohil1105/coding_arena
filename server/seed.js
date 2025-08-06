const mongoose = require('mongoose');
const Problem = require('./models/problem');
require('dotenv').config();

const problems = [
    {
        id: 'two-sum',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
        difficulty: 'Easy',
        tags: ['array', 'hash-table'],
        testCases: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
            { input: 'nums = [3,3], target = 6', output: '[0,1]' }
        ],
        author: 'admin'
    },
    {
        id: 'palindrome-number',
        title: 'Palindrome Number',
        description: 'Given an integer x, return true if x is a palindrome, and false otherwise.\n\nA number is a palindrome when it reads the same backward as forward.\n\nExample 1:\nInput: x = 121\nOutput: true\nExplanation: 121 reads as 121 from left to right and from right to left.',
        difficulty: 'Easy',
        tags: ['math'],
        testCases: [
            { input: 'x = 121', output: 'true' },
            { input: 'x = -121', output: 'false' },
            { input: 'x = 10', output: 'false' }
        ],
        author: 'admin'
    },
    {
        id: 'reverse-string',
        title: 'Reverse String',
        description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\nExample 1:\nInput: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]',
        difficulty: 'Easy',
        tags: ['string', 'two-pointers'],
        testCases: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        author: 'admin'
    },
    {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nExample 1:\nInput: s = "()"\nOutput: true',
        difficulty: 'Easy',
        tags: ['string', 'stack'],
        testCases: [
            { input: 's = "()"', output: 'true' },
            { input: 's = "()[]{}"', output: 'true' },
            { input: 's = "(]"', output: 'false' }
        ],
        author: 'admin'
    },
    {
        id: 'add-two-numbers',
        title: 'Add Two Numbers',
        description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.\n\nExample 1:\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.',
        difficulty: 'Medium',
        tags: ['linked-list', 'math'],
        testCases: [
            { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]' },
            { input: 'l1 = [0], l2 = [0]', output: '[0]' },
            { input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,9,0,0,0,1]' }
        ],
        author: 'admin'
    },
    {
        id: 'longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        description: 'Given a string s, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.\n\nExample 2:\nInput: s = "bbbbb"\nOutput: 1\nExplanation: The answer is "b", with the length of 1.',
        difficulty: 'Medium',
        tags: ['string', 'sliding-window'],
        testCases: [
            { input: 's = "abcabcbb"', output: '3' },
            { input: 's = "bbbbb"', output: '1' },
            { input: 's = "pwwkew"', output: '3' }
        ],
        author: 'admin'
    },
    {
        id: 'container-water',
        title: 'Container With Most Water',
        description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nExample 1:\nInput: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The maximum area is obtained by choosing height[1] = 8 and height[8] = 7.',
        difficulty: 'Medium',
        tags: ['array', 'two-pointers'],
        testCases: [
            { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
            { input: 'height = [1,1]', output: '1' }
        ],
        author: 'admin'
    },
    {
        id: 'merge-sorted-array',
        title: 'Merge Sorted Array',
        description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.\n\nThe final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.\n\nExample 1:\nInput: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\nOutput: [1,2,2,3,5,6]',
        difficulty: 'Easy',
        tags: ['array', 'two-pointers'],
        testCases: [
            { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
            { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]' }
        ],
        author: 'admin'
    },
    {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample 1:\nInput: n = 2\nOutput: 2\nExplanation: There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps',
        difficulty: 'Easy',
        tags: ['dynamic-programming'],
        testCases: [
            { input: 'n = 2', output: '2' },
            { input: 'n = 3', output: '3' },
            { input: 'n = 4', output: '5' }
        ],
        author: 'admin'
    },
    {
        id: 'best-time-stock',
        title: 'Best Time to Buy and Sell Stock',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.\n\nExample 1:\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
        difficulty: 'Easy',
        tags: ['array', 'dynamic-programming'],
        testCases: [
            { input: 'prices = [7,1,5,3,6,4]', output: '5' },
            { input: 'prices = [7,6,4,3,1]', output: '0' }
        ],
        author: 'admin'
    }
];

const seedDB = async () => {
    // Use localhost for local development, mongo for Docker
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/codingarena';
    await mongoose.connect(mongoUrl);
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log('Database seeded with 10 problems!');
    mongoose.connection.close();
};

seedDB();
