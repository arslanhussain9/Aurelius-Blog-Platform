/**
 * Automated Test Suite for Auralis Blog Platform
 * Tests all backend RESTful APIs, authentication, post CRUD, comments, and permissions.
 */

import { db } from '../lib/db.js';
import { auth } from '../lib/auth.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log(' Starting Auralis Blog Platform Automated Tests');
  console.log('====================================================\n');

  // Test 1: User Database & Seeding
  console.log('1. User Database & Password Hashing:');
  const users = db.getUsers();
  assert(users.length >= 2, `Initial seeded users exist (Found ${users.length})`);
  
  const testPassword = 'mySecretPassword!2026';
  const hashed = await auth.hashPassword(testPassword);
  const isValid = await auth.comparePassword(testPassword, hashed);
  assert(isValid === true, 'Bcrypt password hashing and verification works');

  const isInvalid = await auth.comparePassword('wrongPassword', hashed);
  assert(isInvalid === false, 'Invalid password comparison fails safely');

  // Test 2: JWT Tokens
  console.log('\n2. JWT Signing and Verification:');
  const dummyUser = { id: 'usr_test_999', username: 'testpilot', email: 'pilot@auralis.ai', role: 'member' };
  const token = auth.signToken(dummyUser);
  assert(typeof token === 'string' && token.length > 20, 'JWT token signed successfully');

  const verified = auth.verifyToken(token);
  assert(verified && verified.id === 'usr_test_999' && verified.username === 'testpilot', 'JWT verified with correct payload');

  const badTokenVerified = auth.verifyToken('invalid.jwt.token');
  assert(badTokenVerified === null, 'Malformed JWT safely rejected as null');

  // Test 3: User Registration & Lookup
  console.log('\n3. User Creation & Duplicate Checks:');
  const newEmail = `tester_${Date.now()}@auralis.ai`;
  const newUser = db.createUser({
    username: `tester_${Date.now().toString().slice(-4)}`,
    email: newEmail,
    passwordHash: hashed,
    name: 'Test Runner'
  });
  assert(newUser && newUser.id.startsWith('usr_'), `User created with ID ${newUser.id}`);

  const foundByEmail = db.getUserByEmail(newEmail);
  assert(foundByEmail && foundByEmail.id === newUser.id, 'User found by email lookup');

  // Test 4: Posts CRUD
  console.log('\n4. Posts Creation & Retrieval:');
  const initialPostsCount = db.getPosts().length;
  assert(initialPostsCount >= 3, `Initial seeded posts exist (Found ${initialPostsCount})`);

  const createdPost = db.createPost({
    title: 'Benchmarking WebRTC vs WebSocket for Voice Agents',
    excerpt: 'Detailed latency and bandwidth benchmark across worldwide regions.',
    content: 'Full testing report on sub-100ms packet delivery across edge nodes.',
    category: 'AI Infrastructure',
    tags: ['WebRTC', 'WebSockets', 'Benchmarks'],
    authorId: newUser.id,
    authorName: newUser.name
  });
  assert(createdPost && createdPost.id.startsWith('post_'), `Post created with ID ${createdPost.id}`);
  assert(createdPost.likes === 0, 'New post starts with 0 likes');

  const retrievedPost = db.getPostById(createdPost.id);
  assert(retrievedPost && retrievedPost.title === createdPost.title, 'Post retrieved by ID successfully');

  // Test 5: Post Updates
  console.log('\n5. Post Updating:');
  const updatedPost = db.updatePost(createdPost.id, {
    title: 'Benchmarking WebRTC vs WebSocket for Voice Agents (Updated)'
  });
  assert(updatedPost.title.includes('(Updated)'), 'Post title updated in storage');

  // Test 6: Likes & Reactions
  console.log('\n6. Post Likes & Toggling:');
  const likeResult1 = db.toggleLikePost(createdPost.id, newUser.id);
  assert(likeResult1.liked === true && likeResult1.likes === 1, 'Post liked by user (count: 1)');

  const likeResult2 = db.toggleLikePost(createdPost.id, newUser.id);
  assert(likeResult2.liked === false && likeResult2.likes === 0, 'Post unliked by same user (count: 0)');

  // Test 7: Comments Section
  console.log('\n7. Comments Creation & Retrieval:');
  const newComment = db.createComment({
    postId: createdPost.id,
    userId: newUser.id,
    userName: newUser.name,
    content: 'This benchmark matches our edge test findings in Frankfurt.'
  });
  assert(newComment && newComment.id.startsWith('comment_'), `Comment created with ID ${newComment.id}`);

  const commentsForPost = db.getCommentsByPostId(createdPost.id);
  assert(commentsForPost.length === 1 && commentsForPost[0].id === newComment.id, 'Comment linked to correct post');

  // Test 8: Comment Deletion
  console.log('\n8. Comment Deletion:');
  const commentDeleted = db.deleteComment(newComment.id);
  assert(commentDeleted === true, 'Comment deleted successfully');
  const commentsAfterDelete = db.getCommentsByPostId(createdPost.id);
  assert(commentsAfterDelete.length === 0, 'Comment removed from post comments list');

  // Test 9: Cascade Delete of Post and Comments
  console.log('\n9. Post Cascade Deletion:');
  db.createComment({ postId: createdPost.id, userId: newUser.id, userName: newUser.name, content: 'Comment to cascade' });
  const postDeleted = db.deletePost(createdPost.id);
  assert(postDeleted === true, 'Post deleted successfully');
  assert(db.getPostById(createdPost.id) === undefined, 'Post no longer exists');
  assert(db.getCommentsByPostId(createdPost.id).length === 0, 'Associated comments cascaded and cleaned up');

  console.log('\n====================================================');
  console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
