import type {
  AdminCourseApplicationReviewRequest,
  AdminCourseCommentModerationRequest,
  AdminCourseLessonMutationRequest,
  AdminCourseMutationRequest,
  AdminCourseRelationsReplaceRequest,
  AdminCourseSectionMutationRequest,
} from '@sdkwork/clawrouter-backend-sdk';
import {
  getClawRouterBackendSdkClient,
} from 'sdkwork-claw-router-commons/runtime';
import type { AdminCourseListParams } from './courseAdminTypes';

export const DEFAULT_ADMIN_COURSE_PAGE_PARAMS = {
  page: 1,
  pageSize: 100,
} as const satisfies AdminCourseListParams;

export class CourseAdminService {
  static async fetchCourseDashboard() {
    return getClawRouterBackendSdkClient().content.courses.dashboard.retrieve();
  }

  static fetchDashboard() {
    return this.fetchCourseDashboard();
  }

  static async fetchAdminCourses(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return getClawRouterBackendSdkClient().content.courses.list(params);
  }

  static fetchCourses(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return this.fetchAdminCourses(params);
  }

  static async createAdminCourse(input: AdminCourseMutationRequest) {
    return getClawRouterBackendSdkClient().content.courses.create(input);
  }

  static createCourse(input: AdminCourseMutationRequest) {
    return this.createAdminCourse(input);
  }

  static async updateAdminCourse(courseId: string, input: AdminCourseMutationRequest) {
    return getClawRouterBackendSdkClient().content.courses.update(courseId, input);
  }

  static updateCourse(courseId: string, input: AdminCourseMutationRequest) {
    return this.updateAdminCourse(courseId, input);
  }

  static async deleteAdminCourse(courseId: string) {
    return getClawRouterBackendSdkClient().content.courses.delete(courseId);
  }

  static deleteCourse(courseId: string) {
    return this.deleteAdminCourse(courseId);
  }

  static async fetchAdminCourseSections(courseId: string, params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return getClawRouterBackendSdkClient().content.courses.sections.list(courseId, params);
  }

  static fetchSections(courseId: string, params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return this.fetchAdminCourseSections(courseId, params);
  }

  static async createAdminCourseSection(courseId: string, input: AdminCourseSectionMutationRequest) {
    return getClawRouterBackendSdkClient().content.courses.sections.create(courseId, input);
  }

  static createSection(courseId: string, input: AdminCourseSectionMutationRequest) {
    return this.createAdminCourseSection(courseId, input);
  }

  static async updateAdminCourseSection(sectionId: string, input: AdminCourseSectionMutationRequest) {
    return getClawRouterBackendSdkClient().content.courseSections.update(sectionId, input);
  }

  static updateSection(sectionId: string, input: AdminCourseSectionMutationRequest) {
    return this.updateAdminCourseSection(sectionId, input);
  }

  static async deleteAdminCourseSection(sectionId: string) {
    return getClawRouterBackendSdkClient().content.courseSections.delete(sectionId);
  }

  static deleteSection(sectionId: string) {
    return this.deleteAdminCourseSection(sectionId);
  }

  static async fetchAdminCourseLessons(courseId: string, params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return getClawRouterBackendSdkClient().content.courses.lessons.list(courseId, params);
  }

  static fetchLessons(courseId: string, params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return this.fetchAdminCourseLessons(courseId, params);
  }

  static async createAdminCourseLesson(courseId: string, input: AdminCourseLessonMutationRequest) {
    return getClawRouterBackendSdkClient().content.courses.lessons.create(courseId, input);
  }

  static createLesson(courseId: string, input: AdminCourseLessonMutationRequest) {
    return this.createAdminCourseLesson(courseId, input);
  }

  static async updateAdminCourseLesson(lessonId: string, input: AdminCourseLessonMutationRequest) {
    return getClawRouterBackendSdkClient().content.courseLessons.update(lessonId, input);
  }

  static updateLesson(lessonId: string, input: AdminCourseLessonMutationRequest) {
    return this.updateAdminCourseLesson(lessonId, input);
  }

  static async deleteAdminCourseLesson(lessonId: string) {
    return getClawRouterBackendSdkClient().content.courseLessons.delete(lessonId);
  }

  static deleteLesson(lessonId: string) {
    return this.deleteAdminCourseLesson(lessonId);
  }

  static async fetchAdminCourseRelations(courseId: string, params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return getClawRouterBackendSdkClient().content.courses.relations.list(courseId, params);
  }

  static fetchRelations(courseId: string, params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return this.fetchAdminCourseRelations(courseId, params);
  }

  static async replaceAdminCourseRelations(courseId: string, input: AdminCourseRelationsReplaceRequest) {
    return getClawRouterBackendSdkClient().content.courses.relations.replace(courseId, input);
  }

  static replaceRelations(courseId: string, input: AdminCourseRelationsReplaceRequest) {
    return this.replaceAdminCourseRelations(courseId, input);
  }

  static async fetchAdminCourseApplications(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return getClawRouterBackendSdkClient().content.courseApplications.list(params);
  }

  static fetchApplications(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return this.fetchAdminCourseApplications(params);
  }

  static async reviewAdminCourseApplication(applicationId: string, input: AdminCourseApplicationReviewRequest) {
    return getClawRouterBackendSdkClient().content.courseApplications.review(applicationId, input);
  }

  static reviewApplication(applicationId: string, input: AdminCourseApplicationReviewRequest) {
    return this.reviewAdminCourseApplication(applicationId, input);
  }

  static async fetchAdminCourseComments(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return getClawRouterBackendSdkClient().content.courseComments.list(params);
  }

  static fetchComments(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return this.fetchAdminCourseComments(params);
  }

  static async moderateAdminCourseComment(commentId: string, input: AdminCourseCommentModerationRequest) {
    return getClawRouterBackendSdkClient().content.courseComments.moderate(commentId, input);
  }

  static moderateComment(commentId: string, input: AdminCourseCommentModerationRequest) {
    return this.moderateAdminCourseComment(commentId, input);
  }

  static async fetchAdminCourseEngagement(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return getClawRouterBackendSdkClient().content.courseEngagement.list(params);
  }

  static fetchEngagement(params: AdminCourseListParams = DEFAULT_ADMIN_COURSE_PAGE_PARAMS) {
    return this.fetchAdminCourseEngagement(params);
  }
}
