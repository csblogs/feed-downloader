import database from '../database';
import User from '../database/models/user';
import log from '../log';
import getNewPosts from './get-users-new-posts';

export default function aggregate() {
  return new Promise((resolve, reject) => {
    database.sync()
      .then(() =>
        User.findAll({
          attributes: ['id', 'authentication_provider', 'firstName', 'lastName', 'blogFeedURI']
        }))
      .then(users => {
        log.info({ users }, 'Users loaded from database');
        return users;
      })
      .then(users => {
        const getUsersNewPostsPromises = users.map(user => getNewPosts(user));
        log.info('Queued up %s get-users-new-posts promises', getUsersNewPostsPromises.length);
        // TODO: Settle once all users have got feeds.
        // Make transaction so that lastModifiedDates are only updated if new posts added OK
      })
      .then(resolve)
      .catch(reject);
  });
}