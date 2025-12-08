"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import { useDebounce } from "@/utils/debounce/debounce";
import { ROUTES } from "@/constants/AppRoutes/routes";
import {
  ModalMode,
  BusinessStatus,
} from "@/constants/AppResource/status/status";
import { UserFormData } from "@/redux/features/auth/store/models/schema/user.schema";

import { CardHeaderSection } from "@/components/layout/card-header-section";
import { CustomSelect } from "@/components/shared/common/custom-select";
import ResetPasswordModal from "@/components/shared/modal/reset-password-modal";
import { DeleteConfirmationModal } from "@/components/shared/modal/delete-confirmation-modal";
import { BUSINESS_FILTER } from "@/constants/AppResource/status/filter-status";

import { DataTableWithPagination } from "@/components/shared/common/data-table";
import { UserBusinessDetailModal } from "@/redux/features/auth/components/user-business-detail-modal";
import UserBusinessModal from "@/redux/features/auth/components/user-business-modal";
import { usePagination } from "@/redux/store/use-pagination";
import { showToast } from "@/components/shared/common/app-toast";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@/redux/features/auth/store/models/request/users-request";
import {
  createBusinessService,
  deleteBusinessService,
  fetchAllBusinessService,
} from "@/redux/features/master-data/store/thunks/business-thunks";
import { useBusinessState } from "@/redux/features/master-data/store/state/business-state";
import { businessTableColumns } from "@/redux/features/master-data/table/business-table";
import { BusinessResponseModel } from "@/redux/features/master-data/store/models/response/business-response";
import {
  setPageNo,
  setSearchFilter,
  setStatusFilter,
} from "@/redux/features/master-data/store/slice/business-slice";
import { updateBusinessSchema } from "@/models/dashboard/master-data/business/business.schema";
import { CreateBusinessRequest } from "@/models/dashboard/master-data/business/business.request.model";

export default function UserPage() {
  const searchParams = useSearchParams();

  // Redux state
  const {
    businesstate,
    business,
    isLoading,
    filters,
    operations,
    pagination,
    dispatch,
  } = useBusinessState();

  // Local UI state for modals
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: ModalMode.CREATE_MODE,
    businessId: "",
    error: null as string | null,
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    businessId: "",
  });

  const [deleteState, setDeleteState] = useState({
    isOpen: false,
    business: null as BusinessResponseModel | null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { updateUrlWithPage, handlePageChange } = usePagination({
    baseRoute: ROUTES.DASHBOARD.BUSINESS,
  });

  // Initialize URL on mount
  useEffect(() => {
    const pageParam = searchParams.get("pageNo");
    const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

    if (pageFromUrl !== pagination.currentPage) {
      dispatch(setPageNo(pageFromUrl));
    }
  }, [searchParams]);

  // Fetch users when filters change
  useEffect(() => {
    dispatch(
      fetchAllBusinessService({
        search: debouncedSearch,
        pageNo: pagination.currentPage,
        status:
          filters.businessStatus === BusinessStatus.ALL
            ? []
            : [filters.businessStatus],
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    filters.businessStatus,
    pagination.currentPage,
  ]);

  // Event handlers
  const handleCreateUser = () => {
    setModalState({
      isOpen: true,
      mode: ModalMode.CREATE_MODE,
      businessId: "",
      error: null,
    });
  };

  const handleEditBusiness = (business: BusinessResponseModel) => {
    setModalState({
      isOpen: true,
      mode: ModalMode.UPDATE_MODE,
      businessId: business?.id || "",
      error: null,
    });
  };

  const handleViewBusinessDetail = (business: BusinessResponseModel) => {
    setDetailModalState({
      isOpen: true,
      businessId: business.id || "",
    });
  };

  const handleDeleteBusiness = (business: BusinessResponseModel) => {
    setDeleteState({
      isOpen: true,
      business: business,
    });
  };

  const tableHandlers = useMemo(
    () => ({
      handleEditBusiness,
      handleViewBusinessDetail,
      handleDeleteBusiness,
    }),
    []
  );

  const columns = useMemo(
    () =>
      businessTableColumns({
        data: businesstate,
        handlers: tableHandlers,
      }),
    [businesstate, tableHandlers]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleStatusChange = (status: BusinessStatus) => {
    dispatch(setStatusFilter(status));
  };

  const handlePageChangeWrapper = (page: number) => {
    dispatch(setPageNo(page));
    handlePageChange(page);
  };

  const handleSubmit = async (formData: UserFormData): Promise<void> => {
    try {
      setModalState((prev) => ({ ...prev, error: null }));

      const isCreate = modalState.mode === ModalMode.CREATE_MODE;

      if (isCreate) {
        // Ensure all required fields are present (validated by schema)
        const createPayload: CreateBusinessRequest = {
          userIdentifier: formData.userIdentifier!,
          email: formData.email!,
          password: formData.password!,
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          phoneNumber: formData.phoneNumber!,
          userType: formData.userType!,
          accountStatus: formData.accountStatus!,
          roles: formData.roles!,
          position: formData.position,
          address: formData.address,
          notes: formData.notes,
        };

        const response = await dispatch(
          createBusinessService(createPayload)
        ).unwrap();

        showToast.success(
          `Business "${
            response.username || response.email
          }" created successfully`
        );

        closeModal();
      } else {
        // Update mode
        if (!formData.id) {
          throw new Error("Business ID is required for update");
        }

        const updatePayload: UpdateUserRequest = {
          firstName: formData.firstName!,
          lastName: formData.lastName!,
          phoneNumber: formData.phoneNumber!,
          accountStatus: formData.accountStatus!,
          roles: formData.roles!,
          position: formData.position,
          address: formData.address,
          notes: formData.notes,
        };

        const response = await dispatch(
          updateBusinessSchema({ userId: formData.id, userData: updatePayload })
        ).unwrap();

        showToast.success(
          `Business "${
            response.username || response.email
          }" updated successfully`
        );

        closeModal();
      }
    } catch (error: any) {
      const errorMessage = error || "An unexpected error occurred";
      setModalState((prev) => ({ ...prev, error: errorMessage }));
      showToast.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteState.business?.id) return;

    try {
      await dispatch(deleteBusinessService(deleteState.business.id)).unwrap();
      showToast.success("Business deleted successfully");
      closeDeleteModal();

      // Navigate to previous page if this was the last item
      if (business.length === 1 && pagination.currentPage > 1) {
        const newPage = pagination.currentPage - 1;
        dispatch(setPageNo(newPage));
        updateUrlWithPage(newPage);
      }
    } catch (error: any) {
      showToast.error(error || "Failed to delete user");
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: ModalMode.CREATE_MODE,
      businessId: "",
      error: null,
    });
  };

  const closeDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      businessId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteState({
      isOpen: false,
      business: null,
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div className="space-y-4">
        <CardHeaderSection
          breadcrumbs={[
            { label: "Dashboard", href: ROUTES.DASHBOARD.INDEX },
            { label: "Business Users", href: "" },
          ]}
          title="Business Users"
          searchValue={filters.search}
          searchPlaceholder="Search business users..."
          buttonIcon={<Plus className="w-3 h-3" />}
          buttonText="New User"
          onSearchChange={handleSearchChange}
          openModal={handleCreateUser}
        >
          <div className="flex items-center gap-3">
            <CustomSelect
              options={BUSINESS_FILTER}
              value={filters.businessStatus}
              placeholder="All Status"
              onValueChange={(value) =>
                handleStatusChange(value as BusinessStatus)
              }
              label="Business Status"
            />
            {/* <CustomSelect
              options={USER_BUSINESS_ROLE_FILTER}
              value={filters.role}
              placeholder="All Roles"
              onValueChange={(value) => handleRoleChange(value as UserRole)}
              label="Business Role"
            /> */}
          </div>
        </CardHeaderSection>

        {/* Merged DataTable with Pagination */}
        <DataTableWithPagination
          data={business}
          columns={columns}
          loading={isLoading}
          emptyMessage="No business found"
          getRowKey={(business) => business.id?.toString() || business.email}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChangeWrapper}
        />
      </div>

      {/* Modals Add/Edit */}
      <UserBusinessModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        isSubmitting={operations.isCreating || operations.isUpdating}
        onSave={handleSubmit}
        userId={modalState.businessId}
        mode={modalState.mode}
        error={modalState.error}
      />

      {/* Modals User Detail */}
      <UserBusinessDetailModal
        userId={detailModalState.businessId}
        isOpen={detailModalState.isOpen}
        onClose={closeDetailModal}
      />

      {/* Modals Delete User */}
      <DeleteConfirmationModal
        isOpen={deleteState.isOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        title="Delete User"
        description={`Are you sure you want to delete this user ${
          deleteState.business?.fullName || deleteState.business?.email
        }?`}
        itemName={deleteState.business?.fullName || deleteState.business?.email}
        isSubmitting={operations.isDeleting}
      />
    </div>
  );
}
