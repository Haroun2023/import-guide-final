import { ShieldOff } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Route, Router, Switch } from "wouter";
import { readSession } from "@/cms/session";
import { setUser, useCms } from "@/cms/store";
import type { User } from "@/cms/types";
import { Login } from "./Login";
import { ROLES, type Cap } from "./nav";
import { Activity } from "./screens/Activity";
import { Analytics } from "./screens/Analytics";
import { Appearance, Menus } from "./screens/Appearance";
import { Backups } from "./screens/Backups";
import { Dashboard } from "./screens/Dashboard";
import { DeviceEditor, Devices } from "./screens/Devices";
import { Faqs } from "./screens/Faqs";
import { Leads } from "./screens/Leads";
import { Media } from "./screens/Media";
import { HomeBuilder, Pages } from "./screens/Pages";
import { PluginCatalog, Plugins, PluginSettings } from "./screens/Plugins";
import { PostEditor, Posts } from "./screens/Posts";
import { ProgramEditor, Programs } from "./screens/Programs";
import { Redirects } from "./screens/Redirects";
import { Reviews } from "./screens/Reviews";
import { Security } from "./screens/Security";
import { Performance } from "./screens/Performance";
import { Seo } from "./screens/Seo";
import { Settings } from "./screens/Settings";
import { Export, Health } from "./screens/Tools";
import { Users } from "./screens/Users";
import { Shell } from "./Shell";
import { Empty, ToastProvider } from "./ui";

function Guard({ user, cap, children }: { user: User; cap: Cap; children: ReactNode }) {
  if (ROLES[user.role].caps.includes(cap)) return <>{children}</>;
  return <Empty icon={<ShieldOff size={36} />} title="هذه الصفحة خارج صلاحياتك" text={`دورك «${ROLES[user.role].label}»: ${ROLES[user.role].desc}`} />;
}

export default function AdminApp() {
  const [, rerender] = useState(0);
  const users = useCms((s) => s.users);
  const session = readSession();
  const user = session ? users.find((u) => u.id === session.userId) : undefined;
  if (!user) return <Login onDone={() => rerender((n) => n + 1)} />;
  setUser(user.name);

  const g = (cap: Cap, node: ReactNode) => (
    <Guard user={user} cap={cap}>
      {node}
    </Guard>
  );

  return (
    <ToastProvider>
      <Router base="/admin">
        <Shell user={user}>
          <Switch>
            <Route path="/">{g("dashboard", <Dashboard userName={user.name} />)}</Route>
            <Route path="/leads">{g("leads", <Leads />)}</Route>
            <Route path="/posts">{g("content", <Posts />)}</Route>
            <Route path="/posts/:id">{(p) => g("content", <PostEditor id={p.id} key={p.id} />)}</Route>
            <Route path="/media">{g("media", <Media />)}</Route>
            <Route path="/pages">{g("content", <Pages />)}</Route>
            <Route path="/pages/home">{g("content", <HomeBuilder />)}</Route>
            <Route path="/programs">{g("content", <Programs />)}</Route>
            <Route path="/programs/:id">{(p) => g("content", <ProgramEditor id={p.id} key={p.id} />)}</Route>
            <Route path="/devices">{g("content", <Devices />)}</Route>
            <Route path="/devices/:id">{(p) => g("content", <DeviceEditor id={p.id} key={p.id} />)}</Route>
            <Route path="/faqs">{g("content", <Faqs />)}</Route>
            <Route path="/reviews">{g("content", <Reviews />)}</Route>
            <Route path="/appearance">{g("design", <Appearance />)}</Route>
            <Route path="/appearance/menus">{g("design", <Menus />)}</Route>
            <Route path="/plugins">{g("plugins", <Plugins />)}</Route>
            <Route path="/plugins/new">{g("plugins", <PluginCatalog />)}</Route>
            <Route path="/plugins/:id">{(p) => g("plugins", <PluginSettings id={p.id} key={p.id} />)}</Route>
            <Route path="/users">{g("users", <Users />)}</Route>
            <Route path="/settings">{g("settings", <Settings />)}</Route>
            <Route path="/tools">{g("tools", <Health />)}</Route>
            <Route path="/tools/export">{g("tools", <Export />)}</Route>
            <Route path="/backups">{g("tools", <Backups />)}</Route>
            <Route path="/activity">{g("tools", <Activity />)}</Route>
            <Route path="/seo">{g("marketing", <Seo />)}</Route>
            <Route path="/analytics">{g("marketing", <Analytics />)}</Route>
            <Route path="/redirects">{g("marketing", <Redirects />)}</Route>
            <Route path="/security">{g("settings", <Security />)}</Route>
            <Route path="/performance">{g("settings", <Performance />)}</Route>
            <Route>
              <Empty title="الصفحة غير موجودة" text="اختر من القائمة الجانبية." />
            </Route>
          </Switch>
        </Shell>
      </Router>
    </ToastProvider>
  );
}
