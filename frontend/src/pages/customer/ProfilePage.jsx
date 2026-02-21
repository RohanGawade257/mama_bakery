import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <PageContainer>
      <div className="flame-card p-6 sm:p-8">
        <h1 className="page-title text-[#4a4039]">My Profile</h1>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#f1ddca] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-wide text-[#8b7e73]">Name</p>
            <p className="mt-1 font-semibold text-[#4a4039]">{user?.name}</p>
          </div>
          <div className="rounded-2xl border border-[#f1ddca] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-wide text-[#8b7e73]">Email</p>
            <p className="mt-1 font-semibold text-[#4a4039]">{user?.email}</p>
          </div>
          <div className="rounded-2xl border border-[#f1ddca] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-wide text-[#8b7e73]">Role</p>
            <p className="mt-1 font-semibold capitalize text-[#4a4039]">{user?.role}</p>
          </div>
        </div>

        <button type="button" className="outline-button mt-6" onClick={onLogout}>
          Logout
        </button>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;

