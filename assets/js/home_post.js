
{   //method to create post using AJAX
    let createPost = function(){
        let newPostForm = $('#newPost');
    
        newPostForm.submit(function(e) {
        e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/new-post',
                data: newPostForm.serialize(),
                success: function(data) {
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })


        });

    }


    

    // methon to disply post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
  
                    <a class='delete-post-button' href="destroy/${ post._id }">x</a>

                    ${ post.content } (<small> ${ post.user.name }</small>)
                </li>

            <h5>Comments</h5>
            <ul id="post-comment-${ post._id}">
                    
                
            </ul>
                    
                <form action="/new-comment" id="new-comment" method="POST">
                    <input type="text" name="content" placeholder="comment here...">
                    <input type="hidden" name="post" value="${ post._id}">
                    <input type="submit" value="Comment">
                </form>`)
    }

    //method to delete a post from DOM

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                },error: function(error){
                    console.log(error.responseText)
                }
            })
        })
    }


    //method to recieve comment using AJAX
    let createComment = function(){
        let newComments = $('#newComment');

        newComments.submit(function(e){
           e.preventDefault();

           $.ajax({
            type:'post',
            url: '/new-comment',
            data: newComments.serialize(),
            success:function(data){
                console.log(data)
                let newComment = newCommentsDom(data.data.comment);
                $(`#comment-area>ul`).prepend(newComment)
            },error:function(error){
                console.log(error.responseText)
            }

           })
            
        })
    }
    //methon to dispaly comment in DOM
    let newCommentsDom = function(comment){
        return $(`
                <li>
                    
                            
                    <a href="destroyComment/${ comment._id }">x</a>

                    
                    <small>${ comment.user.name }</small>: ${ comment.content }
                </li>
                
        `)
    };


    //method to delete comment using AJAX
    

    // createComment();
    createPost();
}