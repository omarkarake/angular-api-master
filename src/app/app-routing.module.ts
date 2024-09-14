import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: 'home', component: HomeComponent }, // Home route
  {
    path: 'view-post/:id',
    loadChildren: () =>
      import('./feature/post-detail/post-detail.module').then(
        (m) => m.PostDetailModule
      ),
  },
  { path: '**', redirectTo: 'home' }, // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
