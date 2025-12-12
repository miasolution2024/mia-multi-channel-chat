import { RHFCode } from "./rhf-code";
import { RHFEditor } from "./rhf-editor";
import { RHFPhoneInput } from "./rhf-phone-input";
import { RHFRating } from "./rhf-rating";
import { RHFTextField } from "./rhf-text-field";
import { RHFUpload, RHFUploadAvatar, RHFUploadBox } from "./rhf-upload";
import { RHFSelect } from "./rhf-select";
import { RHFAutocomplete } from "./rhf-autocomplete";
import { RHFSwitch } from "./rhf-switch";
import { RHFDatePicker } from "./rhf-date-picker";

export const Field = {
  Text: RHFTextField,
  Rating: RHFRating,
  Upload: RHFUpload,
  Code: RHFCode,
  UploadAvatar: RHFUploadAvatar,
  UploadBox: RHFUploadBox,
  Phone: RHFPhoneInput,
  Editor: RHFEditor,
  Select: RHFSelect,
  Autocomplete: RHFAutocomplete,
  Switch: RHFSwitch,
  DatePicker: RHFDatePicker,
};
