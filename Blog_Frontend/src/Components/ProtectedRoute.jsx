import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";
import {toast} from "react-hot-toast";

function ProtectedRoute({ children, allowedRoles }) {
  //get user login status from store
  const { loading, isCheckingAuth, currentUser, isAuthenticated} = useAuth();
  //loading state
  if (isCheckingAuth || loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-[#0066cc]/60 text-sm animate-pulse">Verifying session...</p>
      </div>
    );
  }
  //if user not loggedin
  if (!isAuthenticated) {
    toast.error("Redirecting to Login")
    //redirect to Login
    return <Navigate to="/login" replace />;
  }

  //check roles
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
   
    //redirect to Login
    return <Navigate to="/unauthorized" replace state={{ redirectTo: "/" }} />;
  }

  return children;
}

export default ProtectedRoute;