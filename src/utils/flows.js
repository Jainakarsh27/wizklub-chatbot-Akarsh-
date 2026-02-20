export const CHAT_FLOW = {
  start: {
    message: "Hii! Welcome to WizKlub. I am Akarsh's AI Assistant. 👋",
    options: [
      { label: "Hi!", next: "choice" }
    ]
  },
  choice: {
    message: "Great to have you here! Are you visiting us as a parent or representing a school?",
    options: [
      { label: "I'm a Parent", next: "parent_name" },
      { label: "I'm representing a School", next: "school_name" }
    ]
  },
  // Parent Flow
  parent_name: {
    message: "Excellent! We help children build future-ready skills. May I know your name?",
    input: "name",
    next: "parent_email"
  },
  parent_email: {
    message: "Nice to meet you, {name}! What is your email address?",
    input: "email",
    next: "parent_phone"
  },
  parent_phone: {
    message: "Got it. And your phone number so we can reach out with more details?",
    input: "phone",
    next: "parent_final"
  },
  parent_final: {
    message: "Thank you, {name}! Your details are recorded. You can view all your session records in your Dashboard. 📊",
    options: [
      { label: "Book a Demo Now", action: "book_demo", url: "https://wizklub.com/programs/hots/" }
    ],
    end: true
  },
  // School Flow
  school_name: {
    message: "Wonderful! We partner with schools to integrate K-12 STEM programs. What is your name?",
    input: "name",
    next: "school_email"
  },
  school_email: {
    message: "Hello {name}! Please share your official email address.",
    input: "email",
    next: "school_phone"
  },
  school_phone: {
    message: "Thanks! What is your contact number?",
    input: "phone",
    next: "school_org"
  },
  school_org: {
    message: "Which school/organization do you represent?",
    input: "school_org_name",
    next: "school_final"
  },
  school_final: {
    message: "Thank you, {name}! Your partnership request is logged. You can track progress in the Dashboard. 🏫",
    options: [
      { label: "Explore Official Website", action: "book_demo", url: "https://wizklub.com/programs/robotics-and-coding/" }
    ],
    end: true
  }
};
