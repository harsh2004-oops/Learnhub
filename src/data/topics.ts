import type { Topic } from '../types';

export const topics: Topic[] = [
  {
    id: 'dsa-fundamentals',
    title: 'Data Structures & Algorithms',
    description: 'Master DSA with Striver\'s comprehensive playlist and practice with curated problems from the SDE Sheet.',
    category: 'Computer Science',
    totalSubtopics: 12,
    estimatedHours: '80-100 hours',
    difficulty: 'Intermediate',
    subtopics: [
      {
        id: 'dsa-intro',
        title: '1. Introduction to Programming',
        description: 'Learn the basics of programming, flowcharts, and pseudocode with Striver.',
        videoUrl: 'https://www.youtube.com/embed/WQoB2z67hvY',
        duration: '60 min',
        order: 1,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular',
            difficulty: 'Easy',
            problemCount: 10
          }
        ]
      },
      {
        id: 'arrays',
        title: '2. Arrays',
        description: 'Master array concepts, operations, and solve important array problems from Striver\'s playlist.',
        videoUrl: 'https://www.youtube.com/embed/37E9ckMDdTk',
        duration: '90 min',
        order: 2,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Arrays',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=arrays',
            difficulty: 'Medium',
            problemCount: 25
          }
        ]
      },
      {
        id: 'math',
        title: '3. Basic Maths',
        description: 'Learn mathematical concepts essential for programming and DSA.',
        videoUrl: 'https://www.youtube.com/embed/1xNbjMdbjug',
        duration: '45 min',
        order: 3,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Math',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=math',
            difficulty: 'Easy',
            problemCount: 12
          }
        ]
      },
      {
        id: 'recursion',
        title: '4. Recursion',
        description: 'Master recursion concepts and solve problems using recursive approach.',
        videoUrl: 'https://www.youtube.com/embed/yVdKa8dnKiE',
        duration: '80 min',
        order: 4,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Recursion',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=recursion',
            difficulty: 'Medium',
            problemCount: 15
          }
        ]
      },
      {
        id: 'hashing',
        title: '5. Hashing',
        description: 'Learn hashing concepts, hash maps, and solve hashing problems.',
        videoUrl: 'https://www.youtube.com/embed/KEs5UyBJ39g',
        duration: '65 min',
        order: 5,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Hashing',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=hashing',
            difficulty: 'Medium',
            problemCount: 14
          }
        ]
      },
      {
        id: 'strings',
        title: '6. Strings',
        description: 'Master string manipulation, pattern matching, and string algorithms.',
        videoUrl: 'https://www.youtube.com/embed/YXJ4deUBKNA',
        duration: '75 min',
        order: 6,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Strings',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=strings',
            difficulty: 'Medium',
            problemCount: 18
          }
        ]
      },
      {
        id: 'linked-lists',
        title: '7. Linked Lists',
        description: 'Learn linked list operations, types, and solve important linked list problems.',
        videoUrl: 'https://www.youtube.com/embed/Nq7ok-OyEpg',
        duration: '95 min',
        order: 7,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Linked Lists',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=linked-list',
            difficulty: 'Medium',
            problemCount: 20
          }
        ]
      },
      {
        id: 'greedy',
        title: '8. Greedy Algorithms',
        description: 'Master greedy approach and solve optimization problems.',
        videoUrl: 'https://www.youtube.com/embed/DIX2p7vb9co',
        duration: '70 min',
        order: 8,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Greedy',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=greedy',
            difficulty: 'Medium',
            problemCount: 16
          }
        ]
      },
      {
        id: 'binary-search',
        title: '9. Binary Search',
        description: 'Learn binary search algorithm and solve search-related problems.',
        videoUrl: 'https://www.youtube.com/embed/WjpswYrS2nY',
        duration: '85 min',
        order: 9,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Binary Search',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=binary-search',
            difficulty: 'Medium',
            problemCount: 18
          }
        ]
      },
      {
        id: 'heaps',
        title: '10. Heaps',
        description: 'Learn heap data structure, priority queues, and heap algorithms.',
        videoUrl: 'https://www.youtube.com/embed/HqPJF2L5h9U',
        duration: '75 min',
        order: 10,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Heaps',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=heap',
            difficulty: 'Medium',
            problemCount: 12
          }
        ]
      },
      {
        id: 'stacks-queues',
        title: '11. Stacks & Queues',
        description: 'Master stack and queue data structures with practical problems.',
        videoUrl: 'https://www.youtube.com/embed/3RhGdmoF_ac',
        duration: '80 min',
        order: 11,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Stacks & Queues',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=stack-queue',
            difficulty: 'Medium',
            problemCount: 16
          }
        ]
      },
      {
        id: 'sliding-window',
        title: '12. Sliding Window & Two Pointers',
        description: 'Learn sliding window technique and two pointers approach for array problems.',
        videoUrl: 'https://www.youtube.com/embed/9kdHxplyl5I',
        duration: '90 min',
        order: 12,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Striver SDE Sheet - Sliding Window',
            url: 'https://codolio.com/question-tracker/sheet/striver-sde-sheet?category=popular&topic=sliding-window',
            difficulty: 'Medium',
            problemCount: 14
          }
        ]
      }
    ]
  },
  {
    id: 'web-development',
    title: 'Full Stack Web Development',
    description: 'Complete web development journey from HTML/CSS to full-stack applications.',
    category: 'Web Development',
    totalSubtopics: 10,
    estimatedHours: '60-80 hours',
    difficulty: 'Beginner',
    subtopics: [
      {
        id: 'html-basics',
        title: '1. HTML Fundamentals',
        description: 'Learn HTML structure, tags, forms, and semantic HTML.',
        videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
        duration: '60 min',
        order: 1,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'FreeCodeCamp',
            url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
            difficulty: 'Easy',
            problemCount: 28
          },
          {
            platform: 'Codepen',
            url: 'https://codepen.io/challenges',
            difficulty: 'Easy',
            problemCount: 10
          }
        ]
      },
      {
        id: 'css-styling',
        title: '2. CSS & Styling',
        description: 'CSS selectors, flexbox, grid, animations, and responsive design.',
        videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc',
        duration: '90 min',
        order: 2,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'CSS Battle',
            url: 'https://cssbattle.dev/',
            difficulty: 'Medium',
            problemCount: 15
          },
          {
            platform: 'Frontend Mentor',
            url: 'https://www.frontendmentor.io/challenges',
            difficulty: 'Medium',
            problemCount: 8
          }
        ]
      },
      {
        id: 'javascript-fundamentals',
        title: '3. JavaScript Fundamentals',
        description: 'Variables, functions, DOM manipulation, and ES6+ features.',
        videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg',
        duration: '120 min',
        order: 3,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'JavaScript30',
            url: 'https://javascript30.com/',
            difficulty: 'Medium',
            problemCount: 30
          },
          {
            platform: 'Codewars',
            url: 'https://www.codewars.com/kata/search/javascript',
            difficulty: 'Easy',
            problemCount: 20
          }
        ]
      },
      {
        id: 'react-basics',
        title: '4. React Fundamentals',
        description: 'Components, props, state, hooks, and React ecosystem.',
        videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
        duration: '150 min',
        order: 4,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'React Challenges',
            url: 'https://react-challenges.vercel.app/',
            difficulty: 'Medium',
            problemCount: 12
          },
          {
            platform: 'Frontend Mentor',
            url: 'https://www.frontendmentor.io/challenges?types=free&technologies=react',
            difficulty: 'Medium',
            problemCount: 6
          }
        ]
      },
      {
        id: 'nodejs-backend',
        title: '5. Node.js & Backend',
        description: 'Server-side JavaScript, Express.js, APIs, and middleware.',
        videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
        duration: '100 min',
        order: 5,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'HackerRank',
            url: 'https://www.hackerrank.com/domains/tutorials/10-days-of-javascript',
            difficulty: 'Medium',
            problemCount: 10
          },
          {
            platform: 'Exercism',
            url: 'https://exercism.org/tracks/javascript',
            difficulty: 'Medium',
            problemCount: 15
          }
        ]
      }
    ]
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Fundamentals',
    description: 'Learn ML from basics to advanced algorithms with hands-on practice.',
    category: 'Artificial Intelligence',
    totalSubtopics: 8,
    estimatedHours: '70-90 hours',
    difficulty: 'Advanced',
    prerequisites: ['Python Programming', 'Statistics', 'Linear Algebra'],
    subtopics: [
      {
        id: 'ml-intro',
        title: '1. Introduction to ML',
        description: 'What is machine learning, types of ML, and basic concepts.',
        videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
        duration: '45 min',
        order: 1,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Kaggle Learn',
            url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
            difficulty: 'Easy',
            problemCount: 7
          }
        ]
      },
      {
        id: 'supervised-learning',
        title: '2. Supervised Learning',
        description: 'Linear regression, logistic regression, and classification algorithms.',
        videoUrl: 'https://www.youtube.com/embed/1BYu65vLKdA',
        duration: '80 min',
        order: 2,
        isCompleted: false,
        practiceLinks: [
          {
            platform: 'Kaggle',
            url: 'https://www.kaggle.com/competitions?search=supervised',
            difficulty: 'Medium',
            problemCount: 5
          },
          {
            platform: 'Google Colab',
            url: 'https://colab.research.google.com/notebooks/ml_fairness_colabs.ipynb',
            difficulty: 'Medium',
            problemCount: 3
          }
        ]
      }
    ]
  }
];