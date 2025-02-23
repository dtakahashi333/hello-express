var multiOpen = document.querySelector("#multi-open");
var titles = document.querySelectorAll(".accordion>.title");
var descriptions = document.querySelectorAll(".accordion>.description");

// Use an arrow function for a forEach callback to make things consistent.
titles.forEach((title) => {
  title.addEventListener("click", function (e) {
    // Multi open behavior
    const description = this.nextElementSibling;
    this.classList.toggle("expanded");
    if (this.classList.contains("expanded")) {
      description.style.display = "flex";
    } else {
      description.style.display = "none";
    }
    if (!multiOpen.checked) {
      // Single open behavior
      // Close other descriptions than being expanded.
      titles.forEach((otherTitle) => {
        // If we want "this" refers to "title", we need to use an arrow function for a callback. Then 
        // "this" can refer to the value of "this" from the outer scope, which is "title".
        // On the other hand, if we use a regular function (functin (otherTitle) { ... }) for a callback,
        // since "this" inside the function refers to the global context (i.e., window in browsers, 
        // or undefined in strict mode), "otherTitle" and "this" never become equalent to each other.
        // Than all the descriptions will be unexpectedly closed.
        // Key Concept: "Calling Context" vs "Lexical Context":
        // The reason why this happens is that "this" in regular functions as a forEach() callback always 
        // refers to global objects where forEach() is even in event listeners (e.g., addEventListener()).
        //
        // In event listeners, when you use a regular function (not an arrow function), this will always 
        // refer to the DOM element that triggered the event. This is a special behavior of event listeners 
        // in JavaScript.
        if (otherTitle !== this) {
          otherTitle.classList.remove("expanded");
          otherTitle.nextElementSibling.style.display = "none";
        }
      });
    }
  });
});

/*
The key difference between the two cases lies in how the keyword `this` behaves within different types of functions: **regular function** vs **arrow function**.

### 1. **Using an Arrow Function:**

```javascript
if (!multiOpen.checked) {
  titles.forEach((otherTitle) => {
    if (otherTitle !== this) {
      otherTitle.classList.remove("expanded");
      otherTitle.nextElementSibling.style.display = "none";
    }
  });
}
```

In this case, you're using an **arrow function** (`=>`) as the callback for `forEach`. Arrow functions **don't have their own `this` context**; instead, they **inherit `this` from their surrounding scope**. So, `this` inside the arrow function refers to the value of `this` **from the outer scope**, which in this case is the `title` element that triggered the click event.

### What happens with `this` in the arrow function:
- When you use `this` inside the arrow function, it refers to the same `this` that was present in the **event listener** callback for the `click` event. That `this` is the **clicked `.title` element** (because you’re inside the `click` event handler).
- In this context, `this` is **the specific `.title` element** that was clicked, so the condition `if (otherTitle !== this)` will check whether the current `otherTitle` being iterated over in `forEach` is the same as the clicked `title` (i.e., `this`).

### 2. **Using a Regular Function:**

```javascript
if (!multiOpen.checked) {
  titles.forEach(function (otherTitle) {
    if (otherTitle !== this) {
      otherTitle.classList.remove("expanded");
      otherTitle.nextElementSibling.style.display = "none";
    }
  });
}
```

In this case, you're using a **regular function** (`function`) as the callback for `forEach`. Regular functions **do have their own `this` context** based on how they are invoked.

However, when you use `this` inside a regular function in an event handler (like the one inside `forEach`), **`this` will refer to the global object** (in browsers, `this` would refer to the `window` object) unless it's explicitly bound to something else.

### What happens with `this` in the regular function:
- In this case, `this` inside the `forEach` callback would likely be the **global object** (`window` in a browser) because `this` is determined by how the function is called. **It doesn't automatically refer to the clicked `.title` element** (the event target).
- Therefore, `this` in the regular function doesn't give you the correct reference, and the condition `if (otherTitle !== this)` will almost certainly not work as expected. It will compare `otherTitle` to `window` (or `undefined` in strict mode), which will always be false and may result in unexpected behavior.

### Why does `this` behave differently?

1. **Arrow functions**:
   - Arrow functions **do not have their own `this`**. Instead, `this` is **lexically inherited** from the surrounding context in which the arrow function is created. In your case, that’s the `click` event handler, so `this` inside the arrow function still refers to the clicked `.title` element.

2. **Regular functions**:
   - Regular functions, on the other hand, have their own `this` based on how they are invoked. Since you're using the function as a callback for `forEach`, **the value of `this` inside the `forEach` callback will refer to the global object (or `undefined` in strict mode)**, not the clicked `.title` element.

### The Fix for Regular Function:

If you need to use a regular function and still want `this` to refer to the clicked element, you can use `.bind(this)` to explicitly bind the correct value of `this`:

```javascript
if (!multiOpen.checked) {
  titles.forEach(function (otherTitle) {
    if (otherTitle !== this) {
      otherTitle.classList.remove("expanded");
      otherTitle.nextElementSibling.style.display = "none";
    }
  }.bind(this));  // Bind 'this' to the current context
}
```

Alternatively, you could store the reference to `this` in a variable (like `clickedTitle`) and use that instead of `this` inside the `forEach` loop:

```javascript
if (!multiOpen.checked) {
  const clickedTitle = this; // Store the reference to the clicked title
  titles.forEach(function (otherTitle) {
    if (otherTitle !== clickedTitle) {
      otherTitle.classList.remove("expanded");
      otherTitle.nextElementSibling.style.display = "none";
    }
  });
}
```

### Summary:

- **Arrow function** (`() => {}`): `this` inherits the context from its surrounding scope, so inside the `forEach` callback, it correctly refers to the clicked `.title` element.
- **Regular function** (`function() {}`): `this` refers to the global object (or `undefined` in strict mode) inside the callback, which won't give the correct result.

To ensure consistency and correctness, it's generally easier to use an **arrow function** in this scenario to retain the correct `this` context.


Can we consider that the arrow functions would always take the value of "this" from outer scope?

Yes, **arrow functions** always take the value of `this` from their **lexical (outer) scope**. This is one of the key differences between arrow functions and regular functions in JavaScript.

### What does "lexical scope" mean?
In JavaScript, **lexical scope** refers to the scope in which a function is defined. When you use an arrow function, it **does not create its own `this`**. Instead, it **inherits the `this` value from the outer function or context** where it was defined. This allows the `this` value to stay consistent with the surrounding code.

### Comparison of `this` behavior:
#### 1. **Arrow Function:**
```javascript
function parentFunction() {
  this.name = "Parent";
  
  const arrowFunction = () => {
    console.log(this.name);  // `this` comes from the parent scope (lexical scoping)
  };
  
  arrowFunction();  // Logs "Parent"
}
```
- Here, `this.name` in the `arrowFunction` refers to `this` from the `parentFunction` because the arrow function **inherits the value of `this`** from its surrounding context (the `parentFunction`).

#### 2. **Regular Function:**
```javascript
function parentFunction() {
  this.name = "Parent";
  
  function regularFunction() {
    console.log(this.name);  // `this` refers to the global object or undefined in strict mode
  }
  
  regularFunction();  // Logs "undefined" (or throws an error in strict mode)
}
```
- In a regular function, `this` is dynamically determined by how the function is invoked. In this case, calling `regularFunction` directly results in `this` being the **global object** (or `undefined` in strict mode), not the `parentFunction`.

### Arrow Functions and `this`:
- **Arrow functions don’t have their own `this`**. Instead, they capture and use the `this` value from the **enclosing scope** when they are defined.
- This makes arrow functions especially useful in situations where you want to maintain the `this` context from a surrounding method or object, such as inside event handlers, setTimeout callbacks, or promises.

### Example: Arrow Function in Event Listeners
Consider this example where the arrow function preserves the `this` value from the surrounding `click` event listener:

```javascript
document.getElementById("button").addEventListener("click", () => {
  console.log(this);  // `this` refers to the element that owns the event listener
});
```
- Here, `this` inside the arrow function refers to the `this` from the enclosing `addEventListener` scope, which could be the `window` object (or another element depending on context). This allows you to access the parent element or context directly in your arrow function, instead of needing to bind `this` explicitly, which you would have to do with a regular function.

### Key Takeaways:
- **Arrow functions always inherit `this` from the surrounding lexical scope.** They never create their own `this` binding.
- **Regular functions** (defined with `function`) have a **dynamic `this`** that depends on how they are invoked.
  
This is why arrow functions are often more convenient in cases where you want to preserve the surrounding context of `this`, such as in event listeners, timeouts, or array methods like `.map()`, `.filter()`, or `.forEach()`.
*/