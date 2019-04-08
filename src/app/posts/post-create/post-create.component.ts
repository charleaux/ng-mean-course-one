import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode: string;
  private postId: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(undefined, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(undefined, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(undefined, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.mode = 'create';
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService
          .getPost(this.postId)
          .subscribe(
            (postData: {
              message: string;
              post: { _id: string; title: string; content: string };
            }) => {
              this.isLoading = false;
              this.post = {
                id: postData.post._id,
                title: postData.post.title,
                content: postData.post.content
              };
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: 'NO-FILE'
              });
            }
          );
      } else {
        this.mode = 'create';
        this.postId = undefined;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return undefined;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
    this.router.navigate(['/']);
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
