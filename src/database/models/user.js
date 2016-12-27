import Sequelize from 'sequelize';
import database from '../';

const URI = Sequelize.STRING(2048);

export default database.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id',
    allowNull: false
  },
  authenticationId: {
    type: Sequelize.STRING,
    field: 'authentication_id',
    allowNull: false
  },
  authenticationProvider: {
    type: Sequelize.ENUM,
    values: ['github', 'stack_exchange', 'wordpress'],
    field: 'authentication_provider',
    allowNull: false
  },
  verified: {
    type: Sequelize.BOOLEAN,
    field: 'verified',
    defaultValue: false,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name',
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name',
    allowNull: false
  },
  emailAddress: {
    type: Sequelize.STRING,
    field: 'email_address',
    allowNull: false
  },
  profilePictureURI: {
    type: URI,
    field: 'profile_picture_uri',
    allowNull: false
  },
  vanityName: {
    type: Sequelize.STRING,
    field: 'vanity_name',
    allowNull: false,
    unique: true
  },
  bio: {
    type: Sequelize.TEXT,
    field: 'bio',
    allowNull: false
  },
  websiteURI: {
    type: URI,
    field: 'website_uri'
  },
  blogURI: {
    type: URI,
    field: 'blog_uri',
    allowNull: false
  },
  blogFeedURI: {
    type: URI,
    field: 'blog_feed_uri',
    allowNull: false,
    unique: true
  },
  cvURI: {
    type: URI,
    field: 'cv_uri'
  },
  linkedInURI: {
    type: URI,
    field: 'linkedin_uri'
  },
  githubUsername: {
    type: Sequelize.STRING,
    field: 'github_username'
  },
  twitterUsername: {
    type: Sequelize.STRING,
    field: 'twitter_username'
  },
  feedLastModified: {
    type: Sequelize.DATE,
    field: 'feed_last_modified'
  }
});
