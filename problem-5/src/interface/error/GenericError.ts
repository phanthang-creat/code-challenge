// Define specific types for better type safety
type LanguageMessages = Record<string, string>;

export class GenericError {
	message: LanguageMessages;
	type: string;
	code: number;
	additionalData?: unknown; // Using unknown instead of any for better type safety

	constructor(message?: LanguageMessages, type?: string, code?: number, additionalData?: unknown) {
		this.message = message || {
			en: "Internal server error",
			vi: "Lỗi máy chủ",
		};
		this.type = type || "InternalServerError";
		this.code = code || 500;
		this.additionalData = additionalData;
	}

	// Factory method to create error instances more easily
	static create(messages: LanguageMessages, type: string, code: number, additionalData?: unknown): GenericError {
		return new GenericError(messages, type, code, additionalData);
	}
}

export const FORBIDDEN = GenericError.create(
	{
		en: "Bạn không có quyền thực hiện thao tác này",
		vi: "You do not have permission to perform this action",
	},
	"Forbidden",
	403,
);

export const USER_NOT_FOUND = GenericError.create(
	{
		en: "User not found",
		vi: "Người dùng không tồn tại",
	},
	"UserNotFound",
	404,
);

export const NOT_AUTHORIZED = GenericError.create(
	{
		en: "Not authorized",
		vi: "Không được ủy quyền",
	},
	"NotAuthorized",
	401,
);

export const INVALID_CREDENTIALS = GenericError.create(
	{
		en: "username or password is incorrect",
		vi: "Tên đăng nhập hoặc mật khẩu không chính xác",
	},
	"InvalidCredentials",
	401,
);

export const USER_IS_BLOCKED = GenericError.create(
	{
		en: "Account is not activated or is blocked",
		vi: "Tài khoản chưa được kích hoạt hoặc đã bị khoá",
	},
	"UserIsNotActivated",
	401,
);

export const CUSTOMER_NOT_FOUND = GenericError.create(
	{
		en: "Customer not found",
		vi: "Khách hàng không tồn tại",
	},
	"CustomerNotFound",
	404,
);

export const CUSTOMER_VERIFICATION_PENDING = GenericError.create(
	{
		en: "Customer verification is pending",
		vi: "Khách hàng chưa xác thực",
	},
	"CustomerVerificationPending",
	400,
);

export const CLERICAL_NOT_FOUND = GenericError.create(
	{
		en: "Clerical not found",
		vi: "Văn thư không tồn tại",
	},
	"ClericalNotFound",
	404,
);

export const CLERICAL_PENDING = GenericError.create(
	{
		en: "Clerical is pending",
		vi: "Văn thư đang chờ xử lý",
	},
	"ClericalPending",
	400,
);

export const MULTIPART_FILE_REQUIRED = GenericError.create(
	{
		en: "File is required",
		vi: "File là bắt buộc",
	},
	"MultipartFileRequired",
	400,
);

export const NO_DATA_IN_SHEETS = GenericError.create(
	{
		en: "No data in sheets",
		vi: "Không có dữ liệu trong bảng",
	},
	"NoDataInSheets",
	400,
);

export const ATTRIBUTE_REQUIRED = GenericError.create(
	{
		en: "Attribute is required",
		vi: "Thuộc tính là bắt buộc",
	},
	"AttributeRequired",
	400,
);

export const BAD_REQUEST = GenericError.create(
	{
		en: "Bad request",
		vi: "Yêu cầu không hợp lệ",
	},
	"BadRequest",
	400,
);

export const PERSONNEL_NOT_FOUND = GenericError.create(
	{
		en: "Personnel not found",
		vi: "Nhân sự không tồn tại",
	},
	"PersonnelNotFound",
	404,
);