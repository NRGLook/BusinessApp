from sqladmin import Admin

from src.config.admin import model_admin
from src.config.database_config import async_engine


def init_admin(app):
    admin = Admin(app, async_engine)
    # USER_CATEGORY
    admin.add_view(model_admin.UserAdmin)
    admin.add_view(model_admin.GroupAdmin)
    admin.add_view(model_admin.UserGroupsAdmin)
    admin.add_view(model_admin.ContractorUserGroupsAdmin)
    admin.add_view(model_admin.UserProjectsAdmin)

    admin.add_view(model_admin.ProjectAdmin)
    admin.add_view(model_admin.QueueAdmin)
    admin.add_view(model_admin.ConstructionObjectAdmin)
    admin.add_view(model_admin.HousingAdmin)
    admin.add_view(model_admin.MontgBlockAdmin)
    admin.add_view(model_admin.SectionAdmin)
    admin.add_view(model_admin.FloorAdmin)

    admin.add_view(model_admin.WorkSetAdmin)
    admin.add_view(model_admin.WorkGroupAdmin)
    admin.add_view(model_admin.WorkTypeAdmin)
    admin.add_view(model_admin.WorkAdmin)

    # DATA_CATEGORY
    admin.add_view(model_admin.WorkPlanAdmin)
    admin.add_view(model_admin.WorkFactAdmin)
    admin.add_view(model_admin.LaborPlanAdmin)
    admin.add_view(model_admin.LaborFactAdmin)
    admin.add_view(model_admin.ContractorWorksAdmin)
    admin.add_view(model_admin.SMRAdmin)

    # ACTIVATION_GROUP_CATEGORY
    admin.add_view(model_admin.EstimateAdmin)
    admin.add_view(model_admin.EstimateSpecificationAdmin)
    admin.add_view(model_admin.RequestLog1CAdmin)
    admin.add_view(model_admin.ActGroupAdmin)
    admin.add_view(model_admin.ActAdmin)
    admin.add_view(model_admin.ActElementAdmin)
    admin.add_view(model_admin.StatusAdmin)
    admin.add_view(model_admin.ContractAnalyticsAdmin)

    # MAILING_CATEGORY
    admin.add_view(model_admin.EmailSendLogAdmin)
    admin.add_view(model_admin.MessageTemplateAdmin)
    admin.add_view(model_admin.ProjectImplementationPlaceMailingUsersAdmin)

    # VIEWS_CATEGORY
    admin.add_view(model_admin.LaborPlanFactViewAdmin)
    admin.add_view(model_admin.FSK_Raport447Admin)
    admin.add_view(model_admin.ProjectstructureUptoFloorLooseViewAdmin)
    admin.add_view(model_admin.WorkstructureUptoWorkLooseViewAdmin)

    # INTEGRATION_CATEGORY
    admin.add_view(model_admin.DataSyncAdmin)
    admin.add_view(model_admin.ContractorWithContractsSyncAdmin)
    admin.add_view(model_admin.ImportMegashablonView)
    admin.add_view(model_admin.ImportTypicalPointWorkView)

    admin.add_view(model_admin.SurveyAdmin)
    admin.add_view(model_admin.SurveyMembersAdmin)
    admin.add_view(model_admin.SurveyQuestionAdmin)
    admin.add_view(model_admin.SurveyQuestionVariantAdmin)
    admin.add_view(model_admin.SurveyAnswerAdmin)
    admin.add_view(model_admin.SurveyAnswerVariantAdmin)

    # INTEGRATION_ISUP_CATEGORY
    admin.add_view(model_admin.IsupTypicalPointAdmin)
    admin.add_view(model_admin.IsupTypicalPointWorkAdmin)
    admin.add_view(model_admin.ArticleBDRAdmin)
    admin.add_view(model_admin.ArticleBDRWorkAdmin)
    admin.add_view(model_admin.ImportArticleBDRView)
    admin.add_view(model_admin.PredictedDatesAdmin)
    admin.add_view(model_admin.SyncPredictedDatesView)

    # DIRECTORIES
    admin.add_view(model_admin.PositionAdmin)
    admin.add_view(model_admin.UnitsAdmin)
    admin.add_view(model_admin.ContractorAdmin)
    admin.add_view(model_admin.ObjectWorksAdmin)
    admin.add_view(model_admin.PositionWorkAdmin)
    admin.add_view(model_admin.ProjectImplementationPlaceAdmin)
    admin.add_view(model_admin.ConstructionAdmin)
    admin.add_view(model_admin.ReasonAdmin)
    admin.add_view(model_admin.WindowOperationAdmin)
    admin.add_view(model_admin.ContractAdmin)

    # LIFECYCLE_CATEGORY
    admin.add_view(model_admin.LifeCycleModelLinkAdmin)
    admin.add_view(model_admin.LifeCycleStatusAdmin)
    admin.add_view(model_admin.LifeCycleActionAdmin)
    admin.add_view(model_admin.ActionFromStateLinkAdmin)
    admin.add_view(model_admin.LifeCycleHistoryAdmin)
