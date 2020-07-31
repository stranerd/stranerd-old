import Bottle from 'bottlejs'
import PostFirebaseDataSource from '@root/modules/posts/data/datasources/post-firebase'
import PostRepository from '@root/modules/posts/data/repositories/post'
import AddPost from '@root/modules/posts/domain/usecases/addPost'
import FindPost from '@root/modules/posts/domain/usecases/findPost'
import GetPosts from '@root/modules/posts/domain/usecases/getPosts'
import PostTransformer from '@root/modules/posts/data/transformers/post'

const bottle = new Bottle()

bottle.service('DataSources.Post', PostFirebaseDataSource)
bottle.service('Transformers.Post', PostTransformer)
bottle.service('Repositories.Post', PostRepository, 'DataSources.Post','Transformers.Post')

bottle.service('Usecases.Post.Add', AddPost, 'Repositories.Post')
bottle.service('Usecases.Post.Find', FindPost, 'Repositories.Post')
bottle.service('Usecases.Post.Get', GetPosts, 'Repositories.Post')

const { Add, Find, Get } = bottle.container.Usecases.Post as {
    Add: (data: object) => Promise<string>,
    Find: (id: string) => Promise<object | undefined>,
    Get: () => Promise<Object[]>
}

export {
    Add as addPost,
    Find as findPost,
    Get as getPosts
}