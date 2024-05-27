import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Nav_options from "./nav_options";
import "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import Landing from "./landing";
import { useRouter } from "next/router";
import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import New_nav from "./new_nav";
import { store } from "../pages/store";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }
  });
  if (user || !user) {
    return (
      <>
        <div className="lg:mx-10">
          <Provider store={store}>
            <PrimeReactProvider>
              {/* <Nav_options /> */}
              <New_nav />
              <Component {...pageProps} />
            </PrimeReactProvider>
            <Toaster />
          </Provider>
        </div>
      </>
    );
  } else {
    return (
      <div>
        <Landing />
      </div>
    );
  }
}
