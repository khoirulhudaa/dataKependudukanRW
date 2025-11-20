import { Navigate, Route, Routes } from "react-router-dom";
import routes from "routes";

export default function Auth() {
  const getRoutes = (routes: RoutesType[]): any => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = "ltr";
  return (
    <div>
      <div className="relative float-right h-full md:min-h-screen w-full !bg-white dark:!bg-navy-900">
        {/* <FixedPlugin /> */}
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex min-h-full w-full flex-col justify-start md:pt-12 md:max-w-[75%] md:h-screen md:px-8 lg:pt-0 md:h-[100vh] xl:max-w-[1383px] px-0">
              <div className="mb-auto flex flex-col md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
                 <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/auth/sign-in" replace />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
