import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle: string;
  enteredContent: string;
  post: Post;
  private mode: string;
  private postId: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.enteredTitle = '';
    this.enteredContent = '';
    this.mode = 'create';
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService
          .getPost(this.postId)
          .subscribe(
            (postData: {
              message: string;
              post: { _id: string; title: string; content: string };
            }) => {
              this.post = {
                id: postData.post._id,
                title: postData.post.title,
                content: postData.post.content
              };
            }
          );
      } else {
        this.mode = 'create';
        this.postId = undefined;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (!form.valid) {
      return undefined;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
