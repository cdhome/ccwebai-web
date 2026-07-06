import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePortalStore } from "@/store/usePortalStore";

export default function RequireAdminRoute() {
  const location = useLocation();
  const { session, authChecked, loadSession } = usePortalStore();

  useEffect(() => {
    if (!authChecked) {
      void loadSession();
    }
  }, [authChecked, loadSession]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050814] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">
          正在校验超管登录状态...
        </div>
      </div>
    );
  }

  if (!session?.isAdmin) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <Outlet />;
}
