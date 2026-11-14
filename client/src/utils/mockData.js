/**
 * Realistic Mock Study Datasets
 * Used for instant demo topics, testing components, and offline previews.
 */

export const MOCK_TOPICS = {
  dbms: {
    title: "Database Management Systems (DBMS)",
    summary: "Essential principles of relational databases, ACID transactions, normalization, and indexing techniques.",
    mode: "both",
    createdAt: new Date().toISOString(),
    flashcards: [
      {
        id: "fc-dbms-1",
        question: "What does the ACID acronym stand for in database transactions?",
        answer: "Atomicity (all or nothing), Consistency (preserves database rules), Isolation (concurrent execution without interference), and Durability (committed data persists across failures).",
        difficulty: "medium",
        userRating: null
      },
      {
        id: "fc-dbms-2",
        question: "What is the primary difference between Clustered and Non-Clustered Indexes?",
        answer: "A Clustered Index alters the physical storage order of table data (only one per table), whereas a Non-Clustered Index creates a separate structure pointing back to data rows (multiple permitted).",
        difficulty: "hard",
        userRating: null
      },
      {
        id: "fc-dbms-3",
        question: "Explain Third Normal Form (3NF) in database design.",
        answer: "A relation is in 3NF if it is in 2NF and has no transitive dependencies (non-prime attributes must depend solely and directly on the candidate key).",
        difficulty: "medium",
        userRating: null
      },
      {
        id: "fc-dbms-4",
        question: "What is Write-Ahead Logging (WAL) and why is it used?",
        answer: "WAL guarantees durability by ensuring changes are recorded in persistent log storage before the corresponding dirty pages are written to the database files.",
        difficulty: "hard",
        userRating: null
      },
      {
        id: "fc-dbms-5",
        question: "What is the difference between TRUNCATE and DELETE in SQL?",
        answer: "DELETE is a DML command that removes rows one by one and can be rolled back; TRUNCATE is a DDL command that deallocates data pages quickly, resets identity seeds, and cannot be rolled back row-by-row.",
        difficulty: "easy",
        userRating: null
      }
    ],
    quiz: [
      {
        id: "q-dbms-1",
        question: "Which transaction isolation level completely prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
        options: ["Read Committed", "Read Uncommitted", "Repeatable Read", "Serializable"],
        correctAnswer: 3,
        explanation: "Serializable is the highest isolation level. It executes transactions in a manner equivalent to serial (non-concurrent) order, eliminating phantom reads.",
        difficulty: "hard"
      },
      {
        id: "q-dbms-2",
        question: "Which of the following database structures is most commonly used for B-Tree indexing in relational storage engines?",
        options: ["Binary Search Tree", "B+ Tree", "Red-Black Tree", "Trie"],
        correctAnswer: 1,
        explanation: "B+ Trees keep all records in the leaf level and link leaves sequentially, making them ideal for disk-block range queries and sequential scans.",
        difficulty: "medium"
      },
      {
        id: "q-dbms-3",
        question: "What type of anomaly occurs when two transactions read the same data and simultaneously update it without locking?",
        options: ["Dirty Read", "Lost Update", "Phantom Read", "Inconsistent Analysis"],
        correctAnswer: 1,
        explanation: "A Lost Update occurs when transaction A overwrites updates made by transaction B without having incorporated B's modifications.",
        difficulty: "medium"
      },
      {
        id: "q-dbms-4",
        question: "In relational algebra, which operator selects rows that satisfy a specified predicate condition?",
        options: ["Projection (π)", "Selection (σ)", "Cartesian Product (×)", "Join (⨝)"],
        correctAnswer: 1,
        explanation: "The Selection operator (sigma σ) filters rows/tuples based on a conditional expression.",
        difficulty: "easy"
      }
    ]
  },

  os: {
    title: "Operating Systems Architecture & Concepts",
    summary: "Core OS principles including process scheduling, virtual memory paging, deadlock prevention, and synchronization.",
    mode: "both",
    createdAt: new Date().toISOString(),
    flashcards: [
      {
        id: "fc-os-1",
        question: "What are the four necessary Coffman conditions for a Deadlock to occur?",
        answer: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait",
        difficulty: "medium",
        userRating: null
      },
      {
        id: "fc-os-2",
        question: "What is Thrashing in virtual memory systems?",
        answer: "Thrashing occurs when the system spends more time swapping pages in and out of swap space than executing actual program instructions due to insufficient physical memory.",
        difficulty: "hard",
        userRating: null
      },
      {
        id: "fc-os-3",
        question: "What is the difference between a Process and a Thread?",
        answer: "A process is an executing program instance with its own isolated address space, while a thread is a lightweight execution path within a process sharing heap, code, and resources.",
        difficulty: "easy",
        userRating: null
      },
      {
        id: "fc-os-4",
        question: "What is the Translation Lookaside Buffer (TLB)?",
        answer: "The TLB is a high-speed hardware memory cache that stores recent virtual-to-physical address translations to accelerate memory access times.",
        difficulty: "hard",
        userRating: null
      }
    ],
    quiz: [
      {
        id: "q-os-1",
        question: "Which CPU scheduling algorithm is provably optimal in terms of minimizing average waiting time for a set of processes?",
        options: ["First-Come, First-Served (FCFS)", "Round Robin (RR)", "Shortest Job First (SJF)", "Priority Scheduling"],
        correctAnswer: 2,
        explanation: "Shortest Job First (SJF) gives the minimum average waiting time by scheduling shorter burst jobs first.",
        difficulty: "medium"
      },
      {
        id: "q-os-2",
        question: "Which system call in POSIX environments creates a duplicate child process?",
        options: ["fork()", "exec()", "pthread_create()", "clone()"],
        correctAnswer: 0,
        explanation: "fork() creates a new child process with a duplicated copy of the calling process's address space.",
        difficulty: "easy"
      },
      {
        id: "q-os-3",
        question: "What is Belady's Anomaly in page replacement algorithms?",
        options: [
          "Page faults decrease when more frames are allocated",
          "Page faults increase when more frames are allocated under FIFO",
          "LRU performance degrades with large memory",
          "Optimal page replacement requires future prediction"
        ],
        correctAnswer: 1,
        explanation: "Belady's Anomaly describes the counter-intuitive phenomenon where allocating more page frames results in more page faults under First-In-First-Out (FIFO).",
        difficulty: "hard"
      }
    ]
  },

  javascript: {
    title: "JavaScript & Modern Web Engineering",
    summary: "Asynchronous JavaScript, the Event Loop, closures, prototypes, and browser execution lifecycle.",
    mode: "both",
    createdAt: new Date().toISOString(),
    flashcards: [
      {
        id: "fc-js-1",
        question: "What is a Closure in JavaScript?",
        answer: "A closure is the combination of a function bundled together with references to its surrounding lexical environment, allowing an inner function to access an outer scope even after the outer function has executed.",
        difficulty: "medium",
        userRating: null
      },
      {
        id: "fc-js-2",
        question: "How does the JavaScript Event Loop prioritize Microtasks vs Macrotasks?",
        answer: "The event loop executes one macrotask (e.g. setTimeout, I/O), then drains the entire Microtask queue (Promise callbacks, queueMicrotask) before rendering or proceeding to the next macrotask.",
        difficulty: "hard",
        userRating: null
      },
      {
        id: "fc-js-3",
        question: "What is the difference between '==' (loose equality) and '===' (strict equality)?",
        answer: "'==' performs implicit type coercion before comparing values, whereas '===' compares both value and type without conversion.",
        difficulty: "easy",
        userRating: null
      }
    ],
    quiz: [
      {
        id: "q-js-1",
        question: "What will be logged by: console.log(typeof null); ?",
        options: ["null", "undefined", "object", "boolean"],
        correctAnswer: 2,
        explanation: "In JavaScript, typeof null returns 'object'. This is a well-known legacy bug originating from JS's initial 32-bit type-tag representation.",
        difficulty: "easy"
      },
      {
        id: "q-js-2",
        question: "Which of the following functions does NOT create its own 'this' binding?",
        options: ["Arrow Function", "Function Declaration", "Function Expression", "Generator Function"],
        correctAnswer: 0,
        explanation: "Arrow functions lexically capture 'this' from the enclosing execution context and cannot be bound with call, apply, or bind.",
        difficulty: "medium"
      },
      {
        id: "q-js-3",
        question: "What is the output order of: setTimeout(() => log(1), 0); Promise.resolve().then(() => log(2)); log(3); ?",
        options: ["1, 2, 3", "3, 1, 2", "3, 2, 1", "2, 3, 1"],
        correctAnswer: 2,
        explanation: "Synchronous code runs first (3), then microtasks in the Promise queue run (2), and lastly macrotasks in timer queue run (1). Result: 3, 2, 1.",
        difficulty: "hard"
      }
    ]
  },

  networks: {
    title: "Computer Networks & Protocols",
    summary: "TCP/IP architecture, HTTP/3, DNS resolution, and routing protocols.",
    mode: "both",
    createdAt: new Date().toISOString(),
    flashcards: [
      {
        id: "fc-net-1",
        question: "What are the three steps of the TCP Three-Way Handshake?",
        answer: "1. Client sends SYN (synchronize sequence number)\n2. Server responds with SYN-ACK\n3. Client sends ACK (acknowledgment) and establishes connection.",
        difficulty: "easy",
        userRating: null
      },
      {
        id: "fc-net-2",
        question: "What transport protocol does HTTP/3 utilize instead of standard TCP?",
        answer: "HTTP/3 runs over QUIC (Quick UDP Internet Connections), which provides multiplexed streams without head-of-line blocking and faster 0-RTT handshakes over UDP.",
        difficulty: "hard",
        userRating: null
      }
    ],
    quiz: [
      {
        id: "q-net-1",
        question: "At which layer of the OSI model does the Internet Protocol (IP) operate?",
        options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
        correctAnswer: 1,
        explanation: "IP operates at Layer 3 (Network Layer), responsible for logical packet addressing and routing across subnets.",
        difficulty: "easy"
      },
      {
        id: "q-net-2",
        question: "Which DNS record type is used to map a domain name to an IPv6 address?",
        options: ["A Record", "CNAME Record", "AAAA Record", "MX Record"],
        correctAnswer: 2,
        explanation: "An AAAA record maps a hostname to an IPv6 address (128-bit), whereas an A record maps to IPv4 (32-bit).",
        difficulty: "medium"
      }
    ]
  }
};
