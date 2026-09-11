# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


<!-- --------------------------------------------------------------------------------------------- -->



  Isme ye screens/features hain:

  - Login page   //     isse login hoga Email:- admin@haven.com  password:- admin@haven.com / visitor123
    Email aur password se login hota hai. Demo password: visitor123

  - Visitor List page
    Saare visitors dikhte hain:
      - Name
      - Phone number
      - Unit/flat number
      - Visit date
      - Status: Pending, Approved, Rejected

  - Visitor actions
    Pending visitor ko:
      - Approve kar sakte ho
      - Reject kar sakte ho
      - Delete kar sakte ho
        Delete se pehle confirmation popup bhi aata hai.

  - Add Visitor page
    Naya visitor add kar sakte ho with:
      - Name
      - Phone
      - Unit number
      - Visit date
        Form mein validation lagi hai — blank ya invalid details submit nahi hongi.

  - Search
    Visitor list mein name, phone, ya unit se search kar sakte ho.

  Use ki hui technologies:

  - React + TypeScript: UI aur type-safe code ke liye
  - Redux Toolkit: login aur visitors ka shared state manage karne ke liye
  - Axios: API calls ke structure ke liye
  - Material UI: professional responsive UI components ke liye
  - Mock API: abhi real backend nahi hai, lekin API layer bilkul real REST API jaisi banayi hai. Backend aa jaaye to mock adapter
    replace karke actual endpoints use kiye ja sakte hain.

  Important files:

  - src/App.tsx — complete UI/screens
  - src/api/client.ts — Axios mock API and dummy visitor data
  - src/features/authSlice.ts — login Redux logic
  - src/features/visitorsSlice.ts — visitor Redux logic
  - src/store.ts — Redux store configuration

  Run karne ke liye:

  npm run dev

 
 