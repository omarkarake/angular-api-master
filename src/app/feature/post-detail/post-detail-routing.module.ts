import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostDetailComponent } from './post-detail.component';
import { PostDetailResolver } from './post-detail-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PostDetailComponent,
    resolve: { post: PostDetailResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostDetailRoutingModule {}
