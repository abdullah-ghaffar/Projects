export const questions = [
  {
    id: 1,
    question: "What is the difference between var, let, and const?",
    answer: "In JavaScript, var is function-scoped and can be re-declared; let and const are block-scoped, with let allowing re-assignment and const preventing it. However, const objects can have their contents modified."
  },
  {
    id: 2,
    question: "What is a closure in JavaScript?",
    answer: "A closure is a function that remembers the variables from its outer (lexical) scope even after the outer function has finished executing."
  },
  {
    id: 3,
    question: "Explain the difference between == and === in JavaScript.",
    answer: "== performs type coercion before comparison, while === checks both value and type without coercion (strict equality)."
  },
  {
    id: 4,
    question: "What is the event loop in JavaScript?",
    answer: "The event loop is a mechanism that allows JavaScript to perform non-blocking operations by handling asynchronous callbacks, promises, and timers."
  },
  {
    id: 5,
    question: "What does 'this' keyword refer to in JavaScript?",
    answer: "The 'this' keyword refers to the object that is executing the current function. Its value depends on how the function is called (global, object method, constructor, etc.)."
  },
  {
    id: 6,
    question: "What is hoisting in JavaScript?",
    answer: "Hoisting is JavaScript's default behavior of moving declarations (var, function) to the top of their scope before code execution. let and const are hoisted but not initialized."
  },
  {
    id: 7,
    question: "Explain the difference between null and undefined.",
    answer: "undefined means a variable has been declared but has no value. null is an intentional absence of any object value, assigned by the programmer."
  }
];