import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider";

const Nav = () => {
  const authContext = useContext(AuthContext);
  const [isLoading, setLoading] = useState();
  const [isLoggedIn, setLoggedIn] = useState();

  const handleLogin = async () => {
    setLoading(true);
    authContext.login({ setLoading });
  }
console.log('isLoading', isLoading)
  useEffect(() => {
    authContext.isAuthenticated ? setLoggedIn(true) : setLoggedIn(false);
  }, [authContext]);

 return (
   <div>
     <div className="top-0 w-full flex flex-wrap">
       <section className="x-auto">
         <nav className="flex justify-between bg-gray-200 text-blue-800 w-screen">
           <div className="px-5 xl:px-12 py-6 flex w-full items-center">
             <h1 className="text-3xl font-bold font-heading">
               Keycloak React AUTH.
             </h1>
             <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
               <li>
                 <a className="hover:text-blue-800" href="/">
                   Home
                 </a>
               </li>
               <li>
                 <a className="hover:text-blue-800" href="/secured">
                   Secured Page
                 </a>
               </li>
             </ul>
             <div className="hidden xl:flex items-center space-x-5">
               <div className="hover:text-gray-200">
               {!isLoggedIn && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => handleLogin()}
                   >
                     Login
                   </button>
                 )}

                 {!!isLoggedIn && (
                   <button
                     type="button"
                     className="text-blue-800"
                     onClick={() => authContext.logout()}
                   >
                     Logout ({authContext.username})
                   </button>
                 )}
               </div>
             </div>
           </div>
         </nav>
       </section>
     </div>
   </div>
 );
};

export default Nav;
