import {
  type ChangeEvent,
  type CSSProperties,
  type Dispatch,
  type FormEvent,
  Fragment,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AddTeamIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  ArtificialIntelligence08Icon,
  Calendar03Icon,
  CalendarClockIcon,
  CalendarUserIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CircleIcon,
  ClipboardListIcon,
  Clock04Icon,
  ComputerIcon,
  Contact01Icon,
  Copy02Icon,
  CreditCardIcon,
  Delete02Icon,
  Dish02Icon,
  FileEmpty01Icon,
  GivePillIcon,
  Globe02Icon,
  HeartbreakIcon,
  ImageUploadIcon,
  MoneyExchange03Icon,
  More01Icon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  PlusSignIcon,
  PuzzleIcon,
  ReceiptDollarIcon,
  Store02Icon,
  SwimmingIcon,
  TapeMeasureIcon,
  Undo02Icon,
  UnfoldMoreIcon,
  UserDollarIcon,
  UserGroup02Icon,
  UserStar01Icon,
  WeightScaleIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { InfoCallout } from "@/components/custom/info-callout";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import emojiLibraryPt from "./emoji-library-pt.json";
import {
  type BrazilCityOption,
  type BrazilStateOption,
  countryOptions,
  DEFAULT_COUNTRY_CODE,
  fallbackBrazilCities,
  fallbackBrazilStates,
  fetchBrazilCities,
  fetchBrazilStates,
  getBrazilCitiesForState,
  isAbortError,
  LocationOptionsError,
} from "./location-options";
import { type ProdutoFormState } from "./ProdutosPage";
import { getVirtualWindow } from "./virtual-list";

type FlowMode = "new" | "edit";
type HugeIconData = typeof Calendar03Icon;
type CommunicationChannel = "E-mail" | "WhatsApp" | "SMS";
type ProductContractMode = "onDemand" | "eventOnly";
type ProductOperatingMode = "everyDay" | "specificPeriods";
type ProductChargeMode = "simplified" | "variableTariff";
type ProductBillingBase = "perPerson" | "closedGroup" | "itemSum";
type ProductDepositChargeMode = "percentage" | "fixedValue";
type ReservationConfirmationMode = "afterPayment" | "manual";
type CartHoldTimeMinutes = "10" | "15" | "30";
type PaymentProxyOption = "mercadoPago" | "pagarme" | "stripe";
type PaymentMethodId = "creditCard" | "pix";
type PaymentInstallmentCount =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";
type EditorEmojiCategoryId =
  | "recent"
  | "smileys"
  | "nature"
  | "food"
  | "travel"
  | "activities"
  | "objects"
  | "symbols"
  | "flags";
type EditorEmojiDataCategoryId = Exclude<EditorEmojiCategoryId, "recent">;
type EditorEmojiLibraryCategory = {
  readonly id: EditorEmojiDataCategoryId;
  readonly label: string;
  readonly emojis: readonly {
    readonly emoji: string;
    readonly name: string;
    readonly keywords: readonly string[];
  }[];
};
type EditorEmojiCategoryOption = {
  readonly id: EditorEmojiCategoryId;
  readonly label: string;
};
type EditorEmojiDataCategoryOption = {
  readonly id: EditorEmojiDataCategoryId;
  readonly label: string;
};
type EditorEmojiItem = {
  readonly emoji: string;
  readonly name: string;
  readonly keywords: readonly string[];
  readonly category: EditorEmojiDataCategoryId;
};
type EditorEmojiSection = {
  readonly id: EditorEmojiCategoryId;
  readonly label: string;
  readonly items: readonly EditorEmojiItem[];
};
type ProductEffortLevel = "unclassified" | "light" | "moderate" | "intense";
type ParticipantDataFormMode = "none" | "simplified" | "complete";
type ParticipantDataField =
  | "weight"
  | "height"
  | "dietaryRestriction"
  | "canSwim"
  | "healthIssue"
  | "healthPlan"
  | "allergy"
  | "continuousMedication"
  | "physicalMentalDisability";
type ProductStepId = "info" | "schedule" | "pricing" | "participant" | "communication" | "settings";
type ScheduleStatus = "Ativo" | "Inativo";
type VariablePricingRuleKind =
  | "ageRange"
  | "specialProfile"
  | "accommodation"
  | "dayType"
  | "seatBatch"
  | "custom";
type VariablePricingStockMode = "productStock" | "customStock";
type VariablePricingAccommodationType = "single" | "double" | "triple" | "quadruple";
type VariablePricingDayType = "weekdays" | "weekend" | "holiday" | "custom";
type VariablePricingBatchBasis = "peopleQuantity" | "purchaseDate";
type ProductPeriodFunctionMode = "weekdays" | "weekend" | "holidays" | "custom";
type ProductPeriodWeekdayId =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
type AdvancedStockToggleId =
  | "companyIntegration"
  | "affiliateStockReservation"
  | "couponLimit"
  | "overbooking";
type LocationSelectOption = {
  readonly value: string;
  readonly label: string;
};
type MeetingPointConfig = {
  readonly id: string;
  readonly name: string;
  readonly mapLink: string;
};
type AdvancedStockToggleOption = {
  readonly id: AdvancedStockToggleId;
  readonly title: string;
  readonly summaryLabel: string;
  readonly description: string;
};
type RouteDayConfig = {
  readonly startTime: string;
  readonly endTime: string;
  readonly title: string;
  readonly product: string;
  readonly required: boolean;
  readonly price: string;
  readonly includedInPrice: boolean;
};
type RouteDayDragState = {
  readonly sourceIndex: number;
  readonly targetIndex: number;
  readonly pointerId: number;
  readonly startClientY: number;
  readonly currentClientY: number;
  readonly rowHeight: number;
  readonly cardCentersY: readonly number[];
};
type ItemConfig = {
  readonly item: string;
  readonly included: boolean;
  readonly value: string;
  readonly complimentary: boolean;
  readonly dailyLimit: string;
  readonly useItemStock: boolean;
};
type ProductPeriodDaySchedule = {
  readonly enabled: boolean;
  readonly startTime: string;
  readonly endTime: string;
};
type ProductPeriodConfig = {
  readonly id: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly hasIndefiniteEndDate: boolean;
  readonly functionModes: readonly ProductPeriodFunctionMode[];
  readonly customDaySchedules: Record<ProductPeriodWeekdayId, ProductPeriodDaySchedule>;
};
type VariablePricingRule = {
  readonly id: string;
  readonly order: number;
  readonly kind: VariablePricingRuleKind;
  readonly title: string;
  readonly value: string;
  readonly stockMode: VariablePricingStockMode;
  readonly customStockMinimum: string;
  readonly customStockNoMinimum: boolean;
  readonly customStock: string;
  readonly validFrom: string;
  readonly validUntil: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly indefiniteValidity: boolean;
  readonly accommodationType: VariablePricingAccommodationType;
  readonly dayType: VariablePricingDayType;
  readonly customWeekdays: readonly ProductPeriodWeekdayId[];
  readonly batchBasis: VariablePricingBatchBasis;
  readonly batchFromPerson: string;
  readonly batchUntilPerson: string;
  readonly batchPurchaseStartDate: string;
  readonly batchPurchaseEndDate: string;
  readonly linkedRules: readonly VariablePricingLinkedRule[];
};
type VariablePricingLinkedRule = {
  readonly id: string;
  readonly order: number;
  readonly kind: VariablePricingRuleKind;
  readonly title: string;
  readonly value: string;
};
type ProductHistoryEvent = {
  readonly title: string;
  readonly occurredAt: string;
  readonly responsible: string;
  readonly highlighted?: boolean;
  readonly responsibleLink?: boolean;
};
type ProductCollaboratorOption = {
  readonly initials: string;
  readonly name: string;
  readonly status: "available" | "allocated";
};
type SelectedProductCollaborator = ProductCollaboratorOption & {
  readonly hasInsurance: boolean;
  readonly isFixed: boolean;
};
type ScheduleTimeConfig = {
  readonly startTime: string;
  readonly endTime: string;
  readonly minimumCapacity: string;
  readonly maximumCapacity: string;
};
type ScheduleTimeSlot = {
  readonly id: string;
  readonly order: number;
  readonly status: ScheduleStatus;
  readonly config: ScheduleTimeConfig;
};
type CloseProductFlowOptions = {
  readonly discardNewProductDraft?: boolean;
};
type ReadinessChecklistState = {
  readonly hasProductInfo: boolean;
  readonly hasSalesChannel: boolean;
  readonly hasConfiguredSchedules: boolean;
  readonly hasAdvertisedPrice: boolean;
  readonly hasCancellationPolicy: boolean;
};
type ProductSummaryRow = {
  readonly label: string;
  readonly value: string;
};
type SalesChannel = "Loja online" | "Marketplace" | "Balcão" | "Afiliados";

interface NewProductFlowProps {
  mode: FlowMode;
  form: ProdutoFormState;
  formError: string;
  onClose: (options?: CloseProductFlowOptions) => void;
  onSave: (event: FormEvent) => void;
  updateForm: <K extends keyof ProdutoFormState>(key: K, value: ProdutoFormState[K]) => void;
}

const steps: readonly { readonly id: ProductStepId; readonly label: string }[] = [
  { id: "info", label: "Informações do produto" },
  { id: "schedule", label: "Programação e vagas" },
  { id: "pricing", label: "Preço e pagamento" },
  { id: "participant", label: "Participante e termos" },
  { id: "communication", label: "Comunicação" },
  { id: "settings", label: "Configurações adicionais" },
];

const productHistoryEvents: readonly ProductHistoryEvent[] = [
  {
    title: "Adição de tags e categorias",
    occurredAt: "20/04/2026, 14:10",
    responsible: "Você",
    highlighted: true,
  },
  {
    title: "Localização alterada",
    occurredAt: "15/04/2026, 10:47",
    responsible: "João Pedro da Silva Oliveira",
  },
  {
    title: "Tarifas editadas",
    occurredAt: "15/04/2026, 10:47",
    responsible: "Maria Eduarda Santos Pereira",
  },
  {
    title: "Saída configurada",
    occurredAt: "15/04/2026, 10:47",
    responsible: "Carlos Ferreira Lima",
  },
  {
    title: "Produto criado",
    occurredAt: "15/04/2026, 10:46",
    responsible: "Carlos Ferreira Lima",
    responsibleLink: true,
  },
];
const productCollaboratorOptions: readonly ProductCollaboratorOption[] = [
  {
    initials: "CH",
    name: "Carlos Henrique Mendes de Carvalho",
    status: "allocated",
  },
  {
    initials: "AC",
    name: "Ana Carolina Oliveira Vasconcelos",
    status: "available",
  },
  {
    initials: "PA",
    name: "Pedro Augusto Santos de Almeida",
    status: "available",
  },
  {
    initials: "FC",
    name: "Fernanda Cristina Lima Montenegro",
    status: "allocated",
  },
  {
    initials: "LG",
    name: "Lucas Gabriel Almeida Nascimento",
    status: "available",
  },
  {
    initials: "BH",
    name: "Beatriz Helena Rocha Figueiredo",
    status: "allocated",
  },
];

function FigmaStepIcon({ stepId }: { stepId: ProductStepId }) {
  switch (stepId) {
    case "info":
      return (
        <svg width="12" height="15" viewBox="0 0 11.8668 14.5334" fill="none" aria-hidden="true">
          <path
            d="M3.26667 3.93333L8.6 3.93333"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.26667 6.6L5.93333 6.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.6 13.6V13.2667C6.6 11.381 6.6 10.4382 7.18579 9.85245C7.77157 9.26667 8.71438 9.26667 10.6 9.26667H10.9333M11.2667 8.1621V5.93333C11.2667 3.41918 11.2667 2.1621 10.4856 1.38105C9.70457 0.600001 8.44749 0.600001 5.93333 0.600001C3.41918 0.600001 2.1621 0.6 1.38105 1.38105C0.600001 2.1621 0.600001 3.41918 0.600001 5.93333L0.600001 8.96277C0.6 11.1261 0.6 12.2078 1.19072 12.9404C1.31005 13.0885 1.44488 13.2233 1.59289 13.3426C2.32554 13.9333 3.40721 13.9333 5.57056 13.9333C6.04092 13.9333 6.27609 13.9333 6.49146 13.8573C6.53625 13.8415 6.58016 13.8233 6.62301 13.8028C6.82904 13.7043 6.99533 13.538 7.32792 13.2054L10.4856 10.0477C10.871 9.66234 11.0637 9.46966 11.1652 9.22463C11.2667 8.9796 11.2667 8.7071 11.2667 8.1621Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "schedule":
      return (
        <svg width="14" height="15" viewBox="0 0 13.2 14.5333" fill="none" aria-hidden="true">
          <path
            d="M9.26667 0.6V3.26667M3.93333 0.6V3.26667"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6 7.26667C12.6 4.75251 12.6 3.49543 11.819 2.71438C11.0379 1.93333 9.78082 1.93333 7.26667 1.93333H5.93333C3.41918 1.93333 2.1621 1.93333 1.38105 2.71438C0.600001 3.49543 0.600001 4.75251 0.600001 7.26667V8.6C0.600001 11.1142 0.600001 12.3712 1.38105 13.1523C2.1621 13.9333 3.41918 13.9333 5.93333 13.9333"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0.600001 5.93333H12.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.7781 11.7341L9.93333 11.2667V10.1112M12.6 11.2667C12.6 12.7394 11.4061 13.9333 9.93333 13.9333C8.46057 13.9333 7.26667 12.7394 7.26667 11.2667C7.26667 9.79391 8.46057 8.6 9.93333 8.6C11.4061 8.6 12.6 9.79391 12.6 11.2667Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pricing":
      return (
        <svg width="11" height="15" viewBox="0 0 10.5333 14.5333" fill="none" aria-hidden="true">
          <path
            d="M9.54444 4.69877C9.54444 3.17146 7.62922 1.93333 5.26667 1.93333C2.90411 1.93333 0.988889 3.17146 0.988889 4.69877C0.988889 6.22607 2.15556 7.06914 5.26667 7.06914C8.37778 7.06914 9.93333 7.85926 9.93333 9.83457C9.93333 11.8099 7.84399 12.6 5.26667 12.6C2.68934 12.6 0.6 11.3619 0.6 9.83457"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M5.26667 0.6V13.9333"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "participant":
      return (
        <svg width="15" height="15" viewBox="0 0 14.5333 14.5333" fill="none" aria-hidden="true">
          <path
            d="M0.600001 6.6C2.15447 4.97188 4.36216 4.89522 5.93333 6.6M4.93006 2.26667C4.93006 3.18714 4.18281 3.93333 3.26102 3.93333C2.33924 3.93333 1.59198 3.18714 1.59198 2.26667C1.59198 1.34619 2.33924 0.6 3.26102 0.6C4.18281 0.6 4.93006 1.34619 4.93006 2.26667Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M8.6 13.9333C10.1545 12.3052 12.3622 12.2286 13.9333 13.9333M12.9301 9.6C12.9301 10.5205 12.1828 11.2667 11.261 11.2667C10.3392 11.2667 9.59198 10.5205 9.59198 9.6C9.59198 8.67953 10.3392 7.93333 11.261 7.93333C12.1828 7.93333 12.9301 8.67953 12.9301 9.6Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M1.26667 8.6C1.26667 11.18 3.35333 13.2667 5.93333 13.2667L5.26667 11.9333"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.26667 1.26667H13.2667M9.26667 3.26667H13.2667M9.26667 5.26667H11.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "communication":
      return (
        <svg width="15" height="15" viewBox="0 0 14.5333 14.5333" fill="none" aria-hidden="true">
          <path
            d="M4.46066 11.9333C4.2431 11.8454 4.12294 11.8028 4.05573 11.811C3.97312 11.8212 3.85327 11.9091 3.61356 12.085C3.19091 12.3952 2.65846 12.618 1.86886 12.5989C1.46958 12.5892 1.26994 12.5843 1.18057 12.4327C1.09119 12.281 1.20251 12.0711 1.42513 11.6513C1.73389 11.069 1.92951 10.4023 1.63309 9.86817C1.12256 9.10523 0.688906 8.20168 0.625537 7.22582C0.591488 6.70148 0.591488 6.15848 0.625537 5.63414C0.799527 2.95476 2.91403 0.820505 5.56861 0.644889C6.47241 0.585098 7.41795 0.584976 8.32359 0.644889C10.9669 0.819758 13.0747 2.93665 13.2643 5.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.06509 13.6981C7.39189 13.5908 6.0591 12.2865 5.94943 10.6491C5.92797 10.3287 5.92797 9.99685 5.94943 9.67642C6.0591 8.03902 7.39189 6.73475 9.06509 6.62743C9.63592 6.59082 10.2319 6.59089 10.8016 6.62743C12.4748 6.73475 13.8076 8.03902 13.9172 9.67642C13.9387 9.99685 13.9387 10.3287 13.9172 10.6491C13.8773 11.2455 13.604 11.7976 13.2822 12.2639C13.0953 12.5903 13.2186 12.9977 13.4132 13.3535C13.5536 13.6101 13.6237 13.7384 13.5674 13.8311C13.5111 13.9238 13.3852 13.9267 13.1336 13.9326C12.6359 13.9443 12.3003 13.8082 12.0339 13.6186C11.8828 13.5111 11.8072 13.4574 11.7552 13.4512C11.7031 13.445 11.6006 13.4857 11.3957 13.5672C11.2116 13.6403 10.9977 13.6855 10.8016 13.6981C10.2319 13.7346 9.63592 13.7347 9.06509 13.6981Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg width="14" height="14" viewBox="0 0 13.8667 13.8667" fill="none" aria-hidden="true">
          <path
            d="M6.922 12.5567C6.34733 12.716 5.65667 12.438 5.48333 11.722C5.44072 11.5461 5.35719 11.3828 5.23953 11.2453C5.12187 11.1079 4.97341 11.0001 4.80623 10.9308C4.63906 10.8616 4.45789 10.8328 4.27748 10.8468C4.09706 10.8607 3.9225 10.9171 3.768 11.0113C2.73933 11.638 1.56133 10.4607 2.188 9.43133C2.28207 9.2769 2.33837 9.10244 2.35232 8.92215C2.36628 8.74186 2.3375 8.56082 2.26831 8.39375C2.19913 8.22667 2.09151 8.07828 1.95418 7.96063C1.81686 7.84298 1.65371 7.7594 1.478 7.71667C0.307333 7.43267 0.307333 5.76733 1.478 5.48333C1.65387 5.44072 1.81719 5.35719 1.95467 5.23953C2.09215 5.12187 2.1999 4.97341 2.26916 4.80623C2.33843 4.63906 2.36723 4.45789 2.35325 4.27748C2.33926 4.09706 2.28287 3.9225 2.18867 3.768C1.562 2.73933 2.73933 1.56133 3.76867 2.188C4.43533 2.59333 5.29933 2.23467 5.48333 1.478C5.76733 0.307333 7.43267 0.307333 7.71667 1.478C7.75928 1.65387 7.84281 1.81719 7.96047 1.95467C8.07813 2.09215 8.22659 2.1999 8.39377 2.26916C8.56094 2.33843 8.74211 2.36723 8.92252 2.35325C9.10294 2.33926 9.2775 2.28287 9.432 2.18867C10.4607 1.562 11.6387 2.73933 11.012 3.76867C10.9179 3.9231 10.8616 4.09756 10.8477 4.27785C10.8337 4.45814 10.8625 4.63918 10.9317 4.80625C11.0009 4.97333 11.1085 5.12172 11.2458 5.23937C11.3831 5.35702 11.5463 5.4406 11.722 5.48333C12.442 5.658 12.7193 6.35533 12.5533 6.932M9.26667 11.2667H13.2667M11.2667 9.26667V13.2667"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 6.6C4.6 7.13043 4.81071 7.63914 5.18579 8.01421C5.56086 8.38929 6.06957 8.6 6.6 8.6C7.13043 8.6 7.63914 8.38929 8.01421 8.01421C8.38929 7.63914 8.6 7.13043 8.6 6.6C8.6 6.06957 8.38929 5.56086 8.01421 5.18579C7.63914 4.81071 7.13043 4.6 6.6 4.6C6.06957 4.6 5.56086 4.81071 5.18579 5.18579C4.81071 5.56086 4.6 6.06957 4.6 6.6Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

const productStepperClassNames = {
  nav: "w-full shrink-0 bg-[#f8fafc] py-4 pr-0 pl-8 lg:w-[266px] lg:py-6 lg:pr-0 lg:pl-8",
  card: "flex w-full flex-col items-start gap-4 rounded-[15px] border border-[#e9eaeb] bg-white p-4 shadow-[0_1px_1.5px_rgba(0,0,0,0.10),0_1px_1px_rgba(0,0,0,0.10)] lg:w-[234px]",
  step: "group relative flex items-center gap-2.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-[#1570ef]/20",
  circle:
    "grid size-[31px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors",
  circleActive: "border-[#1570ef] bg-[#f0f9ff] text-[#1570ef]",
  circleInactive:
    "border-[#a4a7ae] bg-white text-[#717680] group-hover:border-[#717680] group-hover:text-[#535862]",
  label: "font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-none whitespace-nowrap",
  labelActive: "text-[#0b5ed7]",
  labelInactive: "text-[#717680]",
  connector: "absolute top-[31px] left-[15.5px] h-4 w-px bg-[#f5f5f5]",
} as const;

function ProductFlowStepper({
  activeSection,
  onActivate,
}: {
  activeSection: ProductStepId;
  onActivate: (stepId: ProductStepId) => void;
}) {
  return (
    <nav className={productStepperClassNames.nav}>
      <div className={productStepperClassNames.card}>
        <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#181d27]">
          Configurações do produto
        </h2>
        {steps.map((step, index) => {
          const isActive = activeSection === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onActivate(step.id)}
              className={productStepperClassNames.step}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`${productStepperClassNames.circle} ${
                  isActive
                    ? productStepperClassNames.circleActive
                    : productStepperClassNames.circleInactive
                }`}
              >
                <FigmaStepIcon stepId={step.id} />
              </span>
              <span
                className={`${productStepperClassNames.label} ${
                  isActive
                    ? productStepperClassNames.labelActive
                    : productStepperClassNames.labelInactive
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 ? (
                <span className={productStepperClassNames.connector} />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const productTypes = [
  "Atividade",
  "Treinamento / aulas",
  "Excursão de 1 dia",
  "Excursão",
  "Tour privado",
  "Evento",
  "Ingresso",
  "Transporte",
  "Meio de hospedagem",
  "Mercadorias",
  "Aluguel",
  "Comida e Bebida",
  "Assinatura",
  "Cartão presente",
  "Produto personalizado",
];

const advancedStockToggleOptions: readonly AdvancedStockToggleOption[] = [
  {
    id: "companyIntegration",
    title: "Integração entre empresas",
    summaryLabel: "Integração entre empresas",
    description: "Compartilha o mesmo estoque com empresas parceiras.",
  },
  {
    id: "affiliateStockReservation",
    title: "Permitir reserva de estoque por afiliados",
    summaryLabel: "Afiliados reservam vagas do estoque",
    description: "Afiliados reservam vagas do estoque.",
  },
  {
    id: "couponLimit",
    title: "Limite de cupons",
    summaryLabel: "Limite de cupons",
    description: "Cupons podem limitar a quantidade disponível.",
  },
  {
    id: "overbooking",
    title: "Permitir overbooking",
    summaryLabel: "Overbooking",
    description: "Reservas são aceitas além da capacidade máxima estabelecida.",
  },
];
const salesChannelOptions: readonly {
  readonly id: SalesChannel;
  readonly icon: HugeIconData;
  readonly title: string;
  readonly description: string;
}[] = [
  {
    id: "Loja online",
    icon: Store02Icon,
    title: "Loja online (e-commerce)",
    description: "O produto aparece na sua loja e pode ser comprado pelo cliente final.",
  },
  {
    id: "Balcão",
    icon: ComputerIcon,
    title: "Balcão PDV",
    description: "Fica disponível para vendedores adicionarem em pedidos manuais e no caixa.",
  },
  {
    id: "Afiliados",
    icon: UserStar01Icon,
    title: "Divulgação por Afiliados",
    description: "Afiliados com vínculo ativo podem divulgar e vender com comissão.",
  },
  {
    id: "Marketplace",
    icon: Globe02Icon,
    title: "Marketplace",
    description: "Sincroniza com canais integrados, como Airbnb e GetYourGuide.",
  },
];
const reservationConfirmationOptions: readonly {
  readonly value: ReservationConfirmationMode;
  readonly label: string;
}[] = [
  { value: "afterPayment", label: "Confirma reserva após pagamento" },
  { value: "manual", label: "Confirmação manual" },
];
const cartHoldTimeOptions: readonly {
  readonly value: CartHoldTimeMinutes;
  readonly label: string;
}[] = [
  { value: "10", label: "10 minutos após inicio da compra" },
  { value: "15", label: "15 minutos após inicio da compra" },
  { value: "30", label: "30 minutos após inicio da compra" },
];
const paymentProxyOptions: readonly {
  readonly value: PaymentProxyOption;
  readonly label: string;
}[] = [
  { value: "mercadoPago", label: "Mercado Pago" },
  { value: "pagarme", label: "Pagar.me" },
  { value: "stripe", label: "Stripe" },
];
const paymentInstallmentOptions: readonly {
  readonly value: PaymentInstallmentCount;
  readonly label: string;
}[] = [
  { value: "1", label: "1x" },
  { value: "2", label: "2x" },
  { value: "3", label: "3x" },
  { value: "4", label: "4x" },
  { value: "5", label: "5x" },
  { value: "6", label: "6x" },
  { value: "7", label: "7x" },
  { value: "8", label: "8x" },
  { value: "9", label: "9x" },
  { value: "10", label: "10x" },
  { value: "11", label: "11x" },
  { value: "12", label: "12x" },
];

function PixPaymentIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1008 8.60234C20.4769 8.97838 20.8227 9.32422 21.0883 9.63776C21.3748 9.97422 21.6571 10.3732 21.8227 10.8815C22.0591 11.6083 22.0591 12.3912 21.8227 13.118C21.6571 13.6274 21.3748 14.0263 21.0883 14.3628C20.8227 14.6753 20.4769 15.0222 20.1008 15.3982L15.3978 20.1013C15.0654 20.4436 14.72 20.773 14.3624 21.0888C14.026 21.3753 13.626 21.6576 13.1177 21.8232C12.3908 22.0589 11.6081 22.0589 10.8813 21.8232C10.373 21.6576 9.97505 21.3753 9.63651 21.0888C9.32402 20.8232 8.9782 20.4774 8.60216 20.1013L3.89915 15.3982C3.55694 15.0657 3.22754 14.7204 2.91167 14.3628C2.62522 14.0263 2.34294 13.6274 2.17732 13.118C1.94089 12.3912 1.94089 11.6083 2.17732 10.8815C2.34294 10.3732 2.62522 9.97526 2.91167 9.63776C3.17625 9.32526 3.52208 8.97838 3.89915 8.60234L8.60216 3.8992C8.9782 3.52316 9.32402 3.17732 9.63651 2.9117C9.97401 2.62524 10.373 2.34295 10.8813 2.17732C11.608 1.94089 12.391 1.94089 13.1177 2.17732C13.627 2.34295 14.026 2.62524 14.3624 2.9117C14.6749 3.17732 15.0208 3.52212 15.3978 3.8992L20.1008 8.60234ZM17.6603 8.35547L18.9655 9.66068C19.7852 10.4794 20.1946 10.8898 20.3477 11.3617C20.4831 11.7763 20.4831 12.2242 20.3477 12.6388C20.1946 13.1117 19.7852 13.5211 18.9655 14.3399L17.6603 15.6451H16.0843C15.9657 15.6436 15.8488 15.6168 15.7413 15.5665C15.6339 15.5162 15.5385 15.4436 15.4614 15.3534L13.4343 13.1242C13.2527 12.9242 13.0313 12.7644 12.7843 12.6551C12.5373 12.5457 12.2701 12.4892 12 12.4892C11.7299 12.4892 11.4627 12.5457 11.2157 12.6551C10.9687 12.7644 10.7473 12.9242 10.5657 13.1242L8.53758 15.3534C8.46061 15.4434 8.36533 15.516 8.2581 15.5663C8.15087 15.6166 8.03415 15.6434 7.91572 15.6451H6.33868L5.0335 14.3399C4.21477 13.5211 3.8054 13.1107 3.65228 12.6388C3.51859 12.2236 3.51859 11.7769 3.65228 11.3617C3.8054 10.8888 4.21477 10.4794 5.0335 9.66068L6.33868 8.35547H7.91676C8.13447 8.35547 8.3605 8.44922 8.53862 8.64713L10.5667 10.8763C10.7483 11.0763 10.9697 11.2361 11.2167 11.3455C11.4637 11.4548 11.7309 11.5113 12.001 11.5113C12.2712 11.5113 12.5383 11.4548 12.7853 11.3455C13.0324 11.2361 13.2538 11.0763 13.4354 10.8763L15.4624 8.64713C15.5395 8.55698 15.635 8.48433 15.7424 8.43403C15.8498 8.38373 15.9667 8.35695 16.0853 8.35547H17.6603ZM16.1093 6.80442H16.0843C15.4051 6.80442 14.7697 7.10234 14.3135 7.60338L12.2875 9.83359C12.2514 9.87375 12.2072 9.90585 12.1578 9.92783C12.1085 9.9498 12.0551 9.96116 12.001 9.96116C11.947 9.96116 11.8936 9.9498 11.8443 9.92783C11.7949 9.90585 11.7507 9.87375 11.7146 9.83359L9.68547 7.60442C9.46256 7.35478 9.18981 7.15462 8.88482 7.01683C8.57983 6.87904 8.24935 6.80668 7.91468 6.80442H7.88968L9.66047 5.03358C10.4792 4.21483 10.8896 3.80545 11.3604 3.65233C11.7771 3.51691 12.224 3.51691 12.6385 3.65233C13.1114 3.80545 13.5208 4.21483 14.3395 5.03462L16.1093 6.80442ZM16.0843 17.1961H16.1093L14.3385 18.967C13.5208 19.7857 13.1114 20.1951 12.6385 20.3482C12.224 20.4836 11.776 20.4836 11.3604 20.3482C10.8886 20.1951 10.4792 19.7857 9.66047 18.9659L7.88968 17.1951H7.91572C8.59487 17.1951 9.22923 16.8982 9.68547 16.3972L11.7135 14.1669C11.7497 14.1268 11.7939 14.0947 11.8432 14.0727C11.8926 14.0507 11.946 14.0394 12 14.0394C12.054 14.0394 12.1074 14.0507 12.1568 14.0727C12.2061 14.0947 12.2503 14.1268 12.2865 14.1669L14.3145 16.3961C14.5374 16.6458 14.8102 16.8459 15.1152 16.9837C15.4202 17.1215 15.7507 17.1939 16.0853 17.1961"
        fill="currentColor"
      />
    </svg>
  );
}

const paymentMethodOptions: readonly {
  readonly id: PaymentMethodId;
  readonly title: string;
  readonly description: string;
  readonly icon?: HugeIconData;
  readonly iconNode?: ReactNode;
}[] = [
  {
    id: "creditCard",
    title: "Cartão de crédito",
    description: "Permite pagamento parcelado com acréscimo opcional por taxa.",
    icon: CreditCardIcon,
  },
  {
    id: "pix",
    title: "PIX (Pagamento à vista)",
    description: "Permite pagamento instantâneo com desconto opcional.",
    iconNode: <PixPaymentIcon />,
  },
];
const productEffortLevelOptions: readonly {
  readonly value: ProductEffortLevel;
  readonly label: string;
}[] = [
  { value: "unclassified", label: "Sem classificação" },
  { value: "light", label: "Leve" },
  { value: "moderate", label: "Moderado" },
  { value: "intense", label: "Intenso" },
];
const defaultParticipantDataFormMode: ParticipantDataFormMode = "none";
const participantDataFormOptions: readonly {
  readonly id: ParticipantDataFormMode;
  readonly title: string;
  readonly description: string;
  readonly icon: HugeIconData;
}[] = [
  {
    id: "none",
    title: "Sem formulário",
    description:
      "Não coleta dados dos participantes, só do pagador. Jornada de compra mais enxuta.",
    icon: FileEmpty01Icon,
  },
  {
    id: "simplified",
    title: "Simplificado",
    description:
      "Coleta o básico de cada participante para o seguro: nome, data de nascimento, e-mail, telefone e CPF",
    icon: Contact01Icon,
  },
  {
    id: "complete",
    title: "Completo",
    description: "Ficha completa do participante, com os campos que você escolher abaixo.",
    icon: ClipboardListIcon,
  },
];
const participantDataFieldOptions: readonly {
  readonly id: ParticipantDataField;
  readonly label: string;
  readonly icon?: HugeIconData;
  readonly iconNode?: ReactNode;
}[] = [
  { id: "weight", label: "Peso", icon: WeightScaleIcon },
  { id: "height", label: "Altura", icon: TapeMeasureIcon },
  { id: "dietaryRestriction", label: "Possui restrição alimentar", icon: Dish02Icon },
  { id: "canSwim", label: "Sabe nadar", icon: SwimmingIcon },
  { id: "healthIssue", label: "Problema de saúde", icon: HeartbreakIcon },
  { id: "healthPlan", label: "Possui plano de saúde", iconNode: <ParticipantHealthPlanIcon /> },
  { id: "allergy", label: "Possui alergia", iconNode: <ParticipantAllergyIcon /> },
  { id: "continuousMedication", label: "Medicação de uso contínuo", icon: GivePillIcon },
  { id: "physicalMentalDisability", label: "Incapacidade física/mental", icon: PuzzleIcon },
];
const defaultParticipantDataFields: readonly ParticipantDataField[] = ["weight", "height"];
const defaultEmailTemplate = "booking-confirmation";
const defaultWhatsappTemplate = "short-reminder";
const defaultEmailTemplateBody =
  'Olá <span class="communication-template-token">{participante_nome}</span>, sua reserva de <span class="communication-template-token">{produto_nome}</span> para <span class="communication-template-token">{evento_data}</span> às <span class="communication-template-token">{evento_horario}</span> está confirmada. O ponto de encontro é <span class="communication-template-token">{ponto_encontro}</span>. Até lá!';
const defaultWhatsappTemplateBody =
  'Olá <span class="communication-template-token">{participante_nome}</span>!<br>Lembrete: <span class="communication-template-token">{produto_nome}</span> em <span class="communication-template-token">{evento_data}</span> às <span class="communication-template-token">{evento_horario}</span>.<br>O ponto de encontro é em <span class="communication-template-token">{ponto_encontro}</span>.<br>Vemos você lá!';
const communicationTemplateHint = "Os templates salvos são cadastrados na ";
const emailTemplateOptions = [
  { value: defaultEmailTemplate, label: "Confirmação de reserva após pagamento" },
  { value: "pre-event-details", label: "Detalhes completos do pré-evento" },
  { value: "voucher-instructions", label: "Instruções detalhadas do voucher" },
] as const;
const whatsappTemplateOptions = [
  { value: defaultWhatsappTemplate, label: "Lembrete curto" },
  { value: "meeting-point", label: "Ponto de encontro" },
  { value: "same-day-reminder", label: "Reforço no dia da experiência" },
] as const;

const inputClass =
  "h-10 w-full rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-foreground outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-3 focus:ring-primary/20";
const scheduleDrawerInputClass =
  "h-10 w-full rounded-[8px] border border-[#e9eaeb] bg-[#fbfcfd] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27] outline-none transition-colors placeholder:text-[#a4a7ae] focus:border-primary focus:ring-3 focus:ring-primary/20";
const timeInputIconClass =
  "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#717680]";
const selectTriggerClass =
  "!h-[40px] rounded-[8px] border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#717680]";
const selectContentClass =
  "w-(--radix-select-trigger-width) data-[side=bottom]:!translate-y-[3.5px] [&_[data-position=popper]]:!h-auto";
const locationSelectTriggerClass =
  "focus-visible:border-ring focus-visible:ring-ring/30 flex w-full items-center justify-between gap-1.5 border py-2 whitespace-nowrap transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 !h-[40px] rounded-[8px] border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#717680]";
const routeDayReorderGap = 12;
const virtualOptionHeight = 36;
const virtualListHeight = 288;
const virtualOptionOverscan = 6;

const emptyScheduleTimeConfig: ScheduleTimeConfig = {
  startTime: "",
  endTime: "",
  minimumCapacity: "",
  maximumCapacity: "",
};
const initialRouteDayConfig: RouteDayConfig = {
  startTime: "15:45",
  endTime: "18:30",
  title: "Trilha Pico do Itacolomi",
  product: "Carro 3",
  required: true,
  price: "250,00",
  includedInPrice: false,
};
const emptyRouteDayConfig: RouteDayConfig = {
  startTime: "",
  endTime: "",
  title: "",
  product: "",
  required: true,
  price: "",
  includedInPrice: false,
};
const initialRouteDayConfigs: readonly RouteDayConfig[] = [initialRouteDayConfig];
const initialItemConfig: ItemConfig = {
  item: "Almoço p/ 4 pessoas",
  included: true,
  value: "R$ 12,00",
  complimentary: false,
  dailyLimit: "12",
  useItemStock: false,
};
const emptyItemConfig: ItemConfig = {
  item: "",
  included: true,
  value: "",
  complimentary: false,
  dailyLimit: "",
  useItemStock: false,
};
const initialItemConfigs: readonly ItemConfig[] = [initialItemConfig];
const initialScheduleTimeSlots: readonly ScheduleTimeSlot[] = [
  {
    id: "schedule-time-1",
    order: 1,
    status: "Inativo",
    config: emptyScheduleTimeConfig,
  },
];
const productPeriodFunctionModeOptions: readonly {
  readonly id: ProductPeriodFunctionMode;
  readonly label: string;
  readonly summaryLabel: string;
}[] = [
  { id: "weekdays", label: "Seg.a Sex.", summaryLabel: "Seg. a sex." },
  { id: "weekend", label: "Sáb. e Dom.", summaryLabel: "Sáb. e dom." },
  { id: "holidays", label: "Feriados", summaryLabel: "Feriados" },
  { id: "custom", label: "Personalizado", summaryLabel: "Personalizado" },
] as const;
const productPeriodWeekdayOptions: readonly {
  readonly id: ProductPeriodWeekdayId;
  readonly label: string;
}[] = [
  { id: "monday", label: "Seg" },
  { id: "tuesday", label: "Ter" },
  { id: "wednesday", label: "Qua" },
  { id: "thursday", label: "Qui" },
  { id: "friday", label: "Sex" },
  { id: "saturday", label: "Sáb" },
  { id: "sunday", label: "Dom" },
] as const;
const emptyProductPeriodDaySchedule: ProductPeriodDaySchedule = {
  enabled: false,
  startTime: "00:00",
  endTime: "00:00",
};
const emptyProductPeriodDaySchedules: Record<ProductPeriodWeekdayId, ProductPeriodDaySchedule> = {
  monday: emptyProductPeriodDaySchedule,
  tuesday: emptyProductPeriodDaySchedule,
  wednesday: emptyProductPeriodDaySchedule,
  thursday: emptyProductPeriodDaySchedule,
  friday: emptyProductPeriodDaySchedule,
  saturday: emptyProductPeriodDaySchedule,
  sunday: emptyProductPeriodDaySchedule,
};
const emptyProductPeriodConfig: ProductPeriodConfig = {
  id: "product-period-1",
  startDate: "",
  endDate: "",
  hasIndefiniteEndDate: false,
  functionModes: [],
  customDaySchedules: emptyProductPeriodDaySchedules,
};
const initialProductPeriodConfigs: readonly ProductPeriodConfig[] = [emptyProductPeriodConfig];
const createEmptyVariablePricingLinkedRule = (order: number): VariablePricingLinkedRule => ({
  id: `variable-pricing-linked-rule-${order}`,
  order,
  kind: "ageRange",
  title: "",
  value: "",
});
const createEmptyVariablePricingRule = (order: number): VariablePricingRule => ({
  id: `variable-pricing-rule-${order}`,
  order,
  kind: "ageRange",
  title: "",
  value: "",
  stockMode: "productStock",
  customStockMinimum: "",
  customStockNoMinimum: false,
  customStock: "",
  validFrom: "",
  validUntil: "",
  startTime: "",
  endTime: "",
  indefiniteValidity: true,
  accommodationType: "single",
  dayType: "custom",
  customWeekdays: ["wednesday", "friday"],
  batchBasis: "peopleQuantity",
  batchFromPerson: "1",
  batchUntilPerson: "10",
  batchPurchaseStartDate: "",
  batchPurchaseEndDate: "",
  linkedRules: [],
});
const initialVariablePricingRules: readonly VariablePricingRule[] = [
  createEmptyVariablePricingRule(1),
];
const variablePricingProductStockCapacity = 30;
const variablePricingProductStockLabel = `${variablePricingProductStockCapacity} vagas`;
const defaultCommunicationChannels: readonly CommunicationChannel[] = ["E-mail", "WhatsApp"];
const defaultSalesChannels: readonly SalesChannel[] = ["Loja online", "Marketplace"];
const defaultProductUrlSlug = "nome-do-produto";
const suggestedProductOptions: readonly {
  readonly name: string;
  readonly type: string;
}[] = [
  { name: "Cachoeira Fria", type: "Atividade" },
  { name: "Trilha Verde", type: "Atividade" },
  { name: "Trilha Pico do Itacolomi", type: "Atividade" },
  { name: "Cavalgada do Vale", type: "Evento" },
  { name: "Festival das Águas", type: "Evento" },
] as const;
const defaultSuggestedProductNames: readonly string[] = suggestedProductOptions
  .slice(0, 2)
  .map((option) => option.name);
const defaultProductChargeMode: ProductChargeMode = "simplified";
const defaultProductBillingBase: ProductBillingBase = "perPerson";
const defaultClosedGroupPrice = "0";
const defaultIsDepositEnabled = false;
const defaultDepositChargeMode: ProductDepositChargeMode = "percentage";
const defaultDepositPercentage = "";
const defaultDepositFixedValue = "";
const defaultDepositDueDate = "";
const defaultOnlineSurchargePercent = "5%";
const defaultReservationConfirmationMode: ReservationConfirmationMode = "afterPayment";
const defaultCartHoldTimeMinutes: CartHoldTimeMinutes = "10";
const defaultPaymentProxy = "";
const defaultInstallmentCount: PaymentInstallmentCount | "" = "";
const defaultPaymentMethods: readonly PaymentMethodId[] = ["creditCard"];
const defaultCreditCardSurchargePercent = "";
const defaultPixDiscountPercent = "";
const defaultPromotionalPrice = "0";
const defaultResponsibilityTermTitle = "";
const defaultResponsibilityTermText = "";
const initialAdditionalMeetingPointConfigs: readonly MeetingPointConfig[] = [];
const responsibilityTermTextPlaceholder =
  "Aqui vai o texto que sua empresa utiliza para alertar os compradores sobre informações prévias antes da visita entre outros avisos que necessitam de termo de aceite.";
const editorFontSizes = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "22px", value: "22px" },
  { label: "24px", value: "24px" },
  { label: "26px", value: "26px" },
  { label: "28px", value: "28px" },
  { label: "30px", value: "30px" },
  { label: "32px", value: "32px" },
] as const;
const editorDefaultTextColor = "#181D27";
const editorDefaultTextBackgroundColor = "transparent";
const editorDefaultCustomTextColor = "#7F56D9";
const editorDefaultCustomTextBackgroundColor = "#FEF3C7";
const editorToolbarTooltipContextSuffixes = [" na descrição completa", " da descrição completa"];
const editorShortcutLabels = {
  alignCenter: "Ctrl/Cmd + Shift + E",
  alignLeft: "Ctrl/Cmd + Shift + L",
  bold: "Ctrl/Cmd + B",
  bulletList: "Ctrl/Cmd + Shift + 8",
  italic: "Ctrl/Cmd + I",
  link: "Ctrl/Cmd + K",
  orderedList: "Ctrl/Cmd + Shift + 7",
  strikethrough: "Ctrl/Cmd + Shift + X",
  underline: "Ctrl/Cmd + U",
} as const;
const editorTextColors = [
  { value: "#181D27", label: "muito escuro acinzentado azul" },
  { value: "#252B37", label: "muito escuro acinzentado azul" },
  { value: "#414651", label: "escuro acinzentado azul" },
  { value: "#535862", label: "escuro acinzentado azul" },
  { value: "#717680", label: "acinzentado azul" },
  { value: "#A4A7AE", label: "claro pálido azul" },
  { value: "#D5D7DA", label: "muito claro pálido azul-ciano" },
  { value: "#FFFFFF", label: "branco" },
  { value: "#079455", label: "verde-ciano" },
  { value: "#1570EF", label: "vibrante azul-ciano" },
  { value: "#444CE7", label: "escuro vibrante azul" },
  { value: "#6938EF", label: "escuro vibrante roxo" },
  { value: "#BA24D5", label: "vibrante magenta" },
  { value: "#DD2590", label: "vibrante rosa" },
  { value: "#D92D20", label: "vibrante vermelho" },
  { value: "#E04F16", label: "vibrante laranja avermelhado" },
] as const;
const editorTextBackgroundColors = [
  { value: editorDefaultTextBackgroundColor, label: "sem fundo" },
  { value: "#F8FAFC", label: "cinza muito claro" },
  { value: "#F5F5F5", label: "neutro claro" },
  { value: "#FEF3C7", label: "amarelo claro" },
  { value: "#ECFDF3", label: "verde claro" },
  { value: "#E8F0FE", label: "azul claro" },
  { value: "#EEF4FF", label: "azul violeta claro" },
  { value: "#FDF2FA", label: "rosa claro" },
  { value: "#FEE4E2", label: "vermelho claro" },
  { value: "#FFFAEB", label: "laranja claro" },
] as const;
type EditorEmojiLibraryJsonCategory = {
  readonly id: string;
  readonly label: string;
  readonly emojis: readonly {
    readonly emoji: string;
    readonly name: string;
    readonly keywords: readonly string[];
  }[];
};

const editorEmojiFontFamily =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif';
const editorEmojiRecentCategoryOption: EditorEmojiCategoryOption = {
  id: "recent",
  label: "Recentes",
};
const editorEmojiLibraryJsonCategories: readonly EditorEmojiLibraryJsonCategory[] = emojiLibraryPt;
const editorEmojiLibraryCategories: readonly EditorEmojiLibraryCategory[] =
  editorEmojiLibraryJsonCategories.flatMap((category) => {
    const id = getEditorEmojiDataCategoryId(category.id);

    if (id === null) return [];

    return [
      {
        id,
        label: category.label,
        emojis: category.emojis,
      },
    ];
  });
const editorEmojiCategoryOptions: readonly EditorEmojiDataCategoryOption[] =
  editorEmojiLibraryCategories.map((category) => ({
    id: category.id,
    label: category.label,
  }));
const editorEmojiItemsByCategory = new Map<EditorEmojiDataCategoryId, readonly EditorEmojiItem[]>();
editorEmojiLibraryCategories.forEach((category) => {
  editorEmojiItemsByCategory.set(
    category.id,
    category.emojis.map((item) => ({
      emoji: item.emoji,
      name: item.name,
      keywords: item.keywords,
      category: category.id,
    }))
  );
});
const editorEmojiItems: readonly EditorEmojiItem[] = Array.from(
  editorEmojiItemsByCategory.values()
).flat();

function getEditorEmojiDataCategoryId(value: string): EditorEmojiDataCategoryId | null {
  switch (value) {
    case "smileys":
    case "nature":
    case "food":
    case "travel":
    case "activities":
    case "objects":
    case "symbols":
    case "flags":
      return value;
    default:
      return null;
  }
}
const defaultAdvancedStockToggles: Record<AdvancedStockToggleId, boolean> = {
  companyIntegration: true,
  affiliateStockReservation: true,
  couponLimit: true,
  overbooking: true,
};
const newProductFlowDraftStorageKey = "retrilhar:produtos:new-product-flow:v1";

type NewProductFlowDraft = {
  readonly version: 1;
  readonly productContractMode: ProductContractMode;
  readonly productOperatingMode: ProductOperatingMode;
  readonly productPeriodConfigs: readonly ProductPeriodConfig[];
  readonly shortDescription: string;
  readonly mapLink: string;
  readonly isMeetingPointsEnabled: boolean;
  readonly additionalMeetingPointConfigs: readonly MeetingPointConfig[];
  readonly communicationChannels: readonly CommunicationChannel[];
  readonly salesChannels: readonly SalesChannel[];
  readonly preEventReminderHours: string;
  readonly sameDayReminderHours: string;
  readonly minimumParticipants: string;
  readonly maximumParticipants: string;
  readonly durationDays: string;
  readonly isAgeLimitEnabled: boolean;
  readonly minimumAge: string;
  readonly maximumAge: string;
  readonly productEffortLevel: ProductEffortLevel;
  readonly isParticipantDataSheetEnabled: boolean;
  readonly participantDataFormMode: ParticipantDataFormMode;
  readonly participantDataFields: readonly ParticipantDataField[];
  readonly productChargeMode: ProductChargeMode;
  readonly hasConfiguredVariableTariff: boolean;
  readonly variablePricingRules: readonly VariablePricingRule[];
  readonly nextVariablePricingRuleOrder: number;
  readonly productBillingBase: ProductBillingBase;
  readonly closedGroupPrice: string;
  readonly isDepositEnabled: boolean;
  readonly depositChargeMode: ProductDepositChargeMode;
  readonly depositPercentage: string;
  readonly depositFixedValue: string;
  readonly depositDueDate: string;
  readonly onlineSurchargePercent: string;
  readonly reservationConfirmationMode: ReservationConfirmationMode;
  readonly cartHoldTimeMinutes: CartHoldTimeMinutes;
  readonly paymentProxy: PaymentProxyOption | "";
  readonly installmentCount: PaymentInstallmentCount | "";
  readonly paymentMethods: readonly PaymentMethodId[];
  readonly creditCardSurchargePercent: string;
  readonly pixDiscountPercent: string;
  readonly isPromotionalPriceEnabled: boolean;
  readonly promotionalPrice: string;
  readonly promotionStartDate: string;
  readonly promotionEndDate: string;
  readonly responsibilityTermTitle: string;
  readonly responsibilityTermText: string;
  readonly advancedStockSku: string;
  readonly advancedStockBarcode: string;
  readonly advancedStockToggles: Record<AdvancedStockToggleId, boolean>;
  readonly routeDayConfig: RouteDayConfig;
  readonly routeDayConfigs: readonly RouteDayConfig[];
  readonly itemConfig: ItemConfig;
  readonly itemConfigs: readonly ItemConfig[];
  readonly voucherInstructions: string;
  readonly preEventMessage: string;
  readonly isAdvancedStockOpen: boolean;
  readonly isProductItemsEnabled: boolean;
  readonly isProductCollaboratorsEnabled: boolean;
  readonly isTransportIncluded: boolean;
  readonly productUrlSlug: string;
  readonly suggestedProductNames: readonly string[];
  readonly isStorefrontFeatured: boolean;
  readonly seoPageTitle: string;
  readonly seoMetaDescription: string;
  readonly isCustomJavascriptEnabled: boolean;
  readonly customJavascript: string;
  readonly selectedCountryCode: string;
  readonly selectedStateCode: string | null;
  readonly selectedCityId: string | null;
  readonly scheduleSlots: readonly ScheduleTimeSlot[];
  readonly nextScheduleSlotOrder: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string, fallback: string): string {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

function readNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

function readMeetingPointConfig(value: unknown): MeetingPointConfig | null {
  if (!isRecord(value)) return null;

  const id = readString(value, "id", "");
  if (!id) return null;

  return {
    id,
    name: readString(value, "name", ""),
    mapLink: readString(value, "mapLink", ""),
  };
}

function readMeetingPointConfigs(value: unknown): readonly MeetingPointConfig[] {
  if (!Array.isArray(value)) return initialAdditionalMeetingPointConfigs;

  return value.flatMap((item) => {
    const config = readMeetingPointConfig(item);
    return config ? [config] : [];
  });
}

function isCommunicationChannel(value: unknown): value is CommunicationChannel {
  return value === "E-mail" || value === "WhatsApp" || value === "SMS";
}

function readCommunicationChannels(value: unknown): readonly CommunicationChannel[] {
  if (!Array.isArray(value)) return defaultCommunicationChannels;

  const channels = value.filter(isCommunicationChannel);
  return channels.length > 0 ? channels : defaultCommunicationChannels;
}

function isSalesChannel(value: unknown): value is SalesChannel {
  return (
    value === "Loja online" ||
    value === "Marketplace" ||
    value === "Balcão" ||
    value === "Afiliados"
  );
}

function readSalesChannels(value: unknown): readonly SalesChannel[] {
  if (!Array.isArray(value)) return defaultSalesChannels;

  const channels = value.filter(isSalesChannel);
  return channels.length > 0 ? channels : defaultSalesChannels;
}

function readSuggestedProductNames(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return defaultSuggestedProductNames;

  const selectedNames = value.filter(
    (item): item is string =>
      typeof item === "string" && suggestedProductOptions.some((option) => option.name === item)
  );

  return suggestedProductOptions.flatMap((option) =>
    selectedNames.includes(option.name) ? [option.name] : []
  );
}

function readProductEffortLevel(value: unknown): ProductEffortLevel {
  return value === "light" ||
    value === "moderate" ||
    value === "intense" ||
    value === "unclassified"
    ? value
    : "unclassified";
}

function readParticipantDataFormMode(value: unknown): ParticipantDataFormMode {
  if (value === "simplified" || value === "complete") return value;
  return defaultParticipantDataFormMode;
}

function isParticipantDataField(value: unknown): value is ParticipantDataField {
  return (
    value === "weight" ||
    value === "height" ||
    value === "dietaryRestriction" ||
    value === "canSwim" ||
    value === "healthIssue" ||
    value === "healthPlan" ||
    value === "allergy" ||
    value === "continuousMedication" ||
    value === "physicalMentalDisability"
  );
}

function readParticipantDataFields(value: unknown): readonly ParticipantDataField[] {
  if (!Array.isArray(value)) return defaultParticipantDataFields;

  return value.filter(isParticipantDataField);
}

function readProductContractMode(value: unknown): ProductContractMode {
  return value === "eventOnly" ? "eventOnly" : "onDemand";
}

function readProductOperatingMode(value: unknown): ProductOperatingMode {
  return value === "specificPeriods" ? "specificPeriods" : "everyDay";
}

function readProductBillingBase(value: unknown): ProductBillingBase {
  if (value === "closedGroup" || value === "itemSum") return value;
  return defaultProductBillingBase;
}

function readProductChargeMode(value: unknown): ProductChargeMode {
  return value === "variableTariff" ? "variableTariff" : defaultProductChargeMode;
}

function isProductPeriodWeekdayId(value: unknown): value is ProductPeriodWeekdayId {
  return (
    value === "monday" ||
    value === "tuesday" ||
    value === "wednesday" ||
    value === "thursday" ||
    value === "friday" ||
    value === "saturday" ||
    value === "sunday"
  );
}

function isVariablePricingRuleKind(value: unknown): value is VariablePricingRuleKind {
  return (
    value === "ageRange" ||
    value === "specialProfile" ||
    value === "accommodation" ||
    value === "dayType" ||
    value === "seatBatch" ||
    value === "custom"
  );
}

function isVariablePricingStockMode(value: unknown): value is VariablePricingStockMode {
  return value === "productStock" || value === "customStock";
}

function isVariablePricingAccommodationType(
  value: unknown
): value is VariablePricingAccommodationType {
  return value === "single" || value === "double" || value === "triple" || value === "quadruple";
}

function isVariablePricingDayType(value: unknown): value is VariablePricingDayType {
  return value === "weekdays" || value === "weekend" || value === "holiday" || value === "custom";
}

function isVariablePricingBatchBasis(value: unknown): value is VariablePricingBatchBasis {
  return value === "peopleQuantity" || value === "purchaseDate";
}

function readVariablePricingCustomWeekdays(value: unknown): readonly ProductPeriodWeekdayId[] {
  if (!Array.isArray(value)) return createEmptyVariablePricingRule(1).customWeekdays;

  const weekdays = value.filter(isProductPeriodWeekdayId);
  return productPeriodWeekdayOptions.flatMap((weekday) =>
    weekdays.includes(weekday.id) ? [weekday.id] : []
  );
}

function readVariablePricingLinkedRule(value: unknown): VariablePricingLinkedRule | null {
  if (!isRecord(value)) return null;

  const id = readString(value, "id", "");
  const order = value["order"];
  if (!id || typeof order !== "number" || !Number.isInteger(order) || order <= 0) return null;

  const fallback = createEmptyVariablePricingLinkedRule(order);
  return {
    id,
    order,
    kind: isVariablePricingRuleKind(value["kind"]) ? value["kind"] : fallback.kind,
    title: readString(value, "title", fallback.title),
    value: readString(value, "value", fallback.value),
  };
}

function readVariablePricingLinkedRules(value: unknown): readonly VariablePricingLinkedRule[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const linkedRule = readVariablePricingLinkedRule(item);
    return linkedRule ? [linkedRule] : [];
  });
}

function readVariablePricingRule(value: unknown): VariablePricingRule | null {
  if (!isRecord(value)) return null;

  const id = readString(value, "id", "");
  const order = value["order"];
  if (!id || typeof order !== "number" || !Number.isInteger(order) || order <= 0) return null;

  const fallback = createEmptyVariablePricingRule(order);

  return {
    ...fallback,
    id,
    order,
    kind: isVariablePricingRuleKind(value["kind"]) ? value["kind"] : fallback.kind,
    title: readString(value, "title", fallback.title),
    value: readString(value, "value", fallback.value),
    stockMode: isVariablePricingStockMode(value["stockMode"])
      ? value["stockMode"]
      : fallback.stockMode,
    customStockMinimum: readString(value, "customStockMinimum", fallback.customStockMinimum),
    customStockNoMinimum:
      typeof value["customStockNoMinimum"] === "boolean"
        ? value["customStockNoMinimum"]
        : fallback.customStockNoMinimum,
    customStock: readString(value, "customStock", fallback.customStock),
    validFrom: readString(value, "validFrom", fallback.validFrom),
    validUntil: readString(value, "validUntil", fallback.validUntil),
    startTime: readString(value, "startTime", fallback.startTime),
    endTime: readString(value, "endTime", fallback.endTime),
    indefiniteValidity: value["indefiniteValidity"] !== false,
    accommodationType: isVariablePricingAccommodationType(value["accommodationType"])
      ? value["accommodationType"]
      : fallback.accommodationType,
    dayType: isVariablePricingDayType(value["dayType"]) ? value["dayType"] : fallback.dayType,
    customWeekdays: readVariablePricingCustomWeekdays(value["customWeekdays"]),
    batchBasis: isVariablePricingBatchBasis(value["batchBasis"])
      ? value["batchBasis"]
      : fallback.batchBasis,
    batchFromPerson: readString(value, "batchFromPerson", fallback.batchFromPerson),
    batchUntilPerson: readString(value, "batchUntilPerson", fallback.batchUntilPerson),
    batchPurchaseStartDate: readString(
      value,
      "batchPurchaseStartDate",
      fallback.batchPurchaseStartDate
    ),
    batchPurchaseEndDate: readString(value, "batchPurchaseEndDate", fallback.batchPurchaseEndDate),
    linkedRules: readVariablePricingLinkedRules(value["linkedRules"]),
  };
}

function readVariablePricingRules(value: unknown): readonly VariablePricingRule[] {
  if (!Array.isArray(value)) return initialVariablePricingRules;

  const rules = value.flatMap((item) => {
    const rule = readVariablePricingRule(item);
    return rule ? [rule] : [];
  });
  return rules.length > 0 ? rules : initialVariablePricingRules;
}

function readNextVariablePricingRuleOrder(
  value: unknown,
  rules: readonly VariablePricingRule[]
): number {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;

  return Math.max(...rules.map((rule) => rule.order), 0) + 1;
}

function readProductDepositChargeMode(value: unknown): ProductDepositChargeMode {
  return value === "fixedValue" ? "fixedValue" : defaultDepositChargeMode;
}

function readReservationConfirmationMode(value: unknown): ReservationConfirmationMode {
  return value === "manual" ? "manual" : defaultReservationConfirmationMode;
}

function readCartHoldTimeMinutes(value: unknown): CartHoldTimeMinutes {
  if (value === "15" || value === "30") return value;
  return defaultCartHoldTimeMinutes;
}

function readPaymentProxy(value: unknown): PaymentProxyOption | "" {
  if (value === "mercadoPago" || value === "pagarme" || value === "stripe") return value;
  return defaultPaymentProxy;
}

function readPaymentInstallmentCount(value: unknown): PaymentInstallmentCount | "" {
  if (
    value === "1" ||
    value === "2" ||
    value === "3" ||
    value === "4" ||
    value === "5" ||
    value === "6" ||
    value === "7" ||
    value === "8" ||
    value === "9" ||
    value === "10" ||
    value === "11" ||
    value === "12"
  )
    return value;

  return defaultInstallmentCount;
}

function isPaymentMethodId(value: unknown): value is PaymentMethodId {
  return value === "creditCard" || value === "pix";
}

function readPaymentMethods(value: unknown): readonly PaymentMethodId[] {
  if (!Array.isArray(value)) return defaultPaymentMethods;

  const methods = value.filter(isPaymentMethodId);
  return methods.length > 0 ? methods : defaultPaymentMethods;
}

function isProductPeriodFunctionMode(value: unknown): value is ProductPeriodFunctionMode {
  return value === "weekdays" || value === "weekend" || value === "holidays" || value === "custom";
}

function readProductPeriodFunctionModes(
  value: unknown,
  legacyWeekdays: string
): readonly ProductPeriodFunctionMode[] {
  if (!Array.isArray(value)) {
    return legacyWeekdays.trim() ? ["custom"] : [];
  }

  const modes = value.filter(isProductPeriodFunctionMode);
  return productPeriodFunctionModeOptions.flatMap((option) =>
    modes.includes(option.id) ? [option.id] : []
  );
}

function readProductPeriodDaySchedule(value: unknown): ProductPeriodDaySchedule {
  if (!isRecord(value)) return emptyProductPeriodDaySchedule;

  return {
    enabled: value["enabled"] === true,
    startTime: readString(value, "startTime", emptyProductPeriodDaySchedule.startTime),
    endTime: readString(value, "endTime", emptyProductPeriodDaySchedule.endTime),
  };
}

function readProductPeriodDaySchedules(
  value: unknown
): Record<ProductPeriodWeekdayId, ProductPeriodDaySchedule> {
  const schedules = isRecord(value) ? value : {};

  return {
    monday: readProductPeriodDaySchedule(schedules["monday"]),
    tuesday: readProductPeriodDaySchedule(schedules["tuesday"]),
    wednesday: readProductPeriodDaySchedule(schedules["wednesday"]),
    thursday: readProductPeriodDaySchedule(schedules["thursday"]),
    friday: readProductPeriodDaySchedule(schedules["friday"]),
    saturday: readProductPeriodDaySchedule(schedules["saturday"]),
    sunday: readProductPeriodDaySchedule(schedules["sunday"]),
  };
}

function readProductPeriodConfigs(value: unknown): readonly ProductPeriodConfig[] {
  if (!Array.isArray(value)) return initialProductPeriodConfigs;

  const configs = value.flatMap((item) => {
    if (!isRecord(item)) return [];

    const id = readString(item, "id", "");
    const legacyWeekdays = readString(item, "weekdays", "");
    return id
      ? [
          {
            id,
            startDate: readString(item, "startDate", ""),
            endDate: readString(item, "endDate", ""),
            hasIndefiniteEndDate: item["hasIndefiniteEndDate"] === true,
            functionModes: readProductPeriodFunctionModes(item["functionModes"], legacyWeekdays),
            customDaySchedules: readProductPeriodDaySchedules(item["customDaySchedules"]),
          },
        ]
      : [];
  });

  return configs.length > 0 ? configs : initialProductPeriodConfigs;
}

function readAdvancedStockToggles(value: unknown): Record<AdvancedStockToggleId, boolean> {
  if (!isRecord(value)) return defaultAdvancedStockToggles;

  return {
    companyIntegration: value["companyIntegration"] === true,
    affiliateStockReservation: value["affiliateStockReservation"] === true,
    couponLimit: value["couponLimit"] === true,
    overbooking: value["overbooking"] === true,
  };
}

function readRouteDayConfig(value: unknown): RouteDayConfig {
  if (!isRecord(value)) return initialRouteDayConfig;

  return {
    startTime: readString(value, "startTime", initialRouteDayConfig.startTime),
    endTime: readString(value, "endTime", initialRouteDayConfig.endTime),
    title: readString(value, "title", initialRouteDayConfig.title),
    product: readString(value, "product", initialRouteDayConfig.product),
    required: value["required"] === true,
    price: readString(value, "price", initialRouteDayConfig.price),
    includedInPrice: value["includedInPrice"] === true,
  };
}

function readRouteDayConfigs(value: unknown, fallback: RouteDayConfig): readonly RouteDayConfig[] {
  if (!Array.isArray(value)) return [fallback];

  const configs = value.map(readRouteDayConfig);
  return configs.length > 0 ? configs : [fallback];
}

function readItemConfig(value: unknown): ItemConfig {
  if (!isRecord(value)) return initialItemConfig;

  return {
    item: readString(value, "item", initialItemConfig.item),
    included: value["included"] !== false,
    value: readString(value, "value", initialItemConfig.value),
    complimentary: value["complimentary"] === true,
    dailyLimit: readString(value, "dailyLimit", initialItemConfig.dailyLimit),
    useItemStock: value["useItemStock"] === true,
  };
}

function readItemConfigs(value: unknown, fallback: ItemConfig): readonly ItemConfig[] {
  if (!Array.isArray(value)) return [fallback];

  const configs = value.map(readItemConfig);
  return configs.length > 0 ? configs : [fallback];
}

function readScheduleTimeConfig(value: unknown): ScheduleTimeConfig {
  if (!isRecord(value)) return emptyScheduleTimeConfig;

  return {
    startTime: readString(value, "startTime", ""),
    endTime: readString(value, "endTime", ""),
    minimumCapacity: readString(value, "minimumCapacity", ""),
    maximumCapacity: readString(value, "maximumCapacity", ""),
  };
}

function isScheduleStatus(value: unknown): value is ScheduleStatus {
  return value === "Ativo" || value === "Inativo";
}

function readScheduleSlot(value: unknown): ScheduleTimeSlot | null {
  if (!isRecord(value)) return null;

  const id = readString(value, "id", "");
  const order = value["order"];
  if (!id || typeof order !== "number" || !Number.isInteger(order)) return null;

  const statusValue = value["status"];
  return {
    id,
    order,
    status: isScheduleStatus(statusValue) ? statusValue : "Inativo",
    config: readScheduleTimeConfig(value["config"]),
  };
}

function readScheduleSlots(value: unknown): readonly ScheduleTimeSlot[] {
  if (!Array.isArray(value)) return initialScheduleTimeSlots;

  const slots = value.flatMap((item) => {
    const slot = readScheduleSlot(item);
    return slot ? [slot] : [];
  });
  return slots.length > 0 ? slots : initialScheduleTimeSlots;
}

function readNextScheduleSlotOrder(value: unknown, slots: readonly ScheduleTimeSlot[]): number {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;

  return Math.max(...slots.map((slot) => slot.order), 0) + 1;
}

function readNewProductFlowDraft(): NewProductFlowDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(newProductFlowDraftStorageKey);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed["version"] !== 1) return null;

    const scheduleSlots = readScheduleSlots(parsed["scheduleSlots"]);
    const routeDayConfig = readRouteDayConfig(parsed["routeDayConfig"]);
    const routeDayConfigs = readRouteDayConfigs(parsed["routeDayConfigs"], routeDayConfig);
    const itemConfig = readItemConfig(parsed["itemConfig"]);
    const itemConfigs = readItemConfigs(parsed["itemConfigs"], itemConfig);
    const variablePricingRules = readVariablePricingRules(parsed["variablePricingRules"]);
    return {
      version: 1,
      productContractMode: readProductContractMode(parsed["productContractMode"]),
      productOperatingMode: readProductOperatingMode(parsed["productOperatingMode"]),
      productPeriodConfigs: readProductPeriodConfigs(parsed["productPeriodConfigs"]),
      shortDescription: readString(parsed, "shortDescription", ""),
      mapLink: readString(parsed, "mapLink", ""),
      isMeetingPointsEnabled: parsed["isMeetingPointsEnabled"] !== false,
      additionalMeetingPointConfigs: readMeetingPointConfigs(
        parsed["additionalMeetingPointConfigs"]
      ),
      communicationChannels: readCommunicationChannels(parsed["communicationChannels"]),
      salesChannels: readSalesChannels(parsed["salesChannels"]),
      preEventReminderHours: readString(parsed, "preEventReminderHours", "24"),
      sameDayReminderHours: readString(parsed, "sameDayReminderHours", "0"),
      minimumParticipants: readString(parsed, "minimumParticipants", ""),
      maximumParticipants: readString(parsed, "maximumParticipants", ""),
      durationDays: readString(parsed, "durationDays", ""),
      isAgeLimitEnabled: parsed["isAgeLimitEnabled"] === true,
      minimumAge: onlyDigits(readString(parsed, "minimumAge", "")),
      maximumAge: onlyDigits(readString(parsed, "maximumAge", "")),
      productEffortLevel: readProductEffortLevel(parsed["productEffortLevel"]),
      isParticipantDataSheetEnabled: parsed["isParticipantDataSheetEnabled"] !== false,
      participantDataFormMode: readParticipantDataFormMode(parsed["participantDataFormMode"]),
      participantDataFields: readParticipantDataFields(parsed["participantDataFields"]),
      productChargeMode: readProductChargeMode(parsed["productChargeMode"]),
      hasConfiguredVariableTariff: parsed["hasConfiguredVariableTariff"] === true,
      variablePricingRules,
      nextVariablePricingRuleOrder: readNextVariablePricingRuleOrder(
        parsed["nextVariablePricingRuleOrder"],
        variablePricingRules
      ),
      productBillingBase: readProductBillingBase(parsed["productBillingBase"]),
      closedGroupPrice: readString(parsed, "closedGroupPrice", defaultClosedGroupPrice),
      isDepositEnabled: parsed["isDepositEnabled"] === true,
      depositChargeMode: readProductDepositChargeMode(parsed["depositChargeMode"]),
      depositPercentage: readString(parsed, "depositPercentage", defaultDepositPercentage),
      depositFixedValue: readString(parsed, "depositFixedValue", defaultDepositFixedValue),
      depositDueDate: readString(parsed, "depositDueDate", defaultDepositDueDate),
      onlineSurchargePercent: readString(
        parsed,
        "onlineSurchargePercent",
        defaultOnlineSurchargePercent
      ),
      reservationConfirmationMode: readReservationConfirmationMode(
        parsed["reservationConfirmationMode"]
      ),
      cartHoldTimeMinutes: readCartHoldTimeMinutes(parsed["cartHoldTimeMinutes"]),
      paymentProxy: readPaymentProxy(parsed["paymentProxy"]),
      installmentCount: readPaymentInstallmentCount(parsed["installmentCount"]),
      paymentMethods: readPaymentMethods(parsed["paymentMethods"]),
      creditCardSurchargePercent: readString(
        parsed,
        "creditCardSurchargePercent",
        defaultCreditCardSurchargePercent
      ),
      pixDiscountPercent: readString(parsed, "pixDiscountPercent", defaultPixDiscountPercent),
      isPromotionalPriceEnabled: parsed["isPromotionalPriceEnabled"] !== false,
      promotionalPrice: readString(parsed, "promotionalPrice", defaultPromotionalPrice),
      promotionStartDate: readString(parsed, "promotionStartDate", ""),
      promotionEndDate: readString(parsed, "promotionEndDate", ""),
      responsibilityTermTitle: readString(
        parsed,
        "responsibilityTermTitle",
        defaultResponsibilityTermTitle
      ),
      responsibilityTermText: readString(
        parsed,
        "responsibilityTermText",
        defaultResponsibilityTermText
      ),
      advancedStockSku: readString(parsed, "advancedStockSku", "SAM-CEL-S24-CZ-256"),
      advancedStockBarcode: readString(parsed, "advancedStockBarcode", "7622300847791"),
      advancedStockToggles: readAdvancedStockToggles(parsed["advancedStockToggles"]),
      routeDayConfig,
      routeDayConfigs,
      itemConfig,
      itemConfigs,
      voucherInstructions: readString(
        parsed,
        "voucherInstructions",
        "Leve documento com foto, água e calçado fechado."
      ),
      preEventMessage: readString(
        parsed,
        "preEventMessage",
        "Chegue 30 minutos antes para conferência do grupo."
      ),
      isAdvancedStockOpen: parsed["isAdvancedStockOpen"] === true,
      isProductItemsEnabled: parsed["isProductItemsEnabled"] !== false,
      isProductCollaboratorsEnabled: parsed["isProductCollaboratorsEnabled"] !== false,
      isTransportIncluded: parsed["isTransportIncluded"] !== false,
      productUrlSlug: readString(parsed, "productUrlSlug", ""),
      suggestedProductNames: readSuggestedProductNames(parsed["suggestedProductNames"]),
      isStorefrontFeatured: parsed["isStorefrontFeatured"] !== false,
      seoPageTitle: readString(parsed, "seoPageTitle", ""),
      seoMetaDescription: readString(parsed, "seoMetaDescription", ""),
      isCustomJavascriptEnabled: parsed["isCustomJavascriptEnabled"] !== false,
      customJavascript: readString(parsed, "customJavascript", ""),
      selectedCountryCode: readString(parsed, "selectedCountryCode", DEFAULT_COUNTRY_CODE),
      selectedStateCode: readNullableString(parsed, "selectedStateCode"),
      selectedCityId: readNullableString(parsed, "selectedCityId"),
      scheduleSlots,
      nextScheduleSlotOrder: readNextScheduleSlotOrder(
        parsed["nextScheduleSlotOrder"],
        scheduleSlots
      ),
    };
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof DOMException) return null;
    throw error;
  }
}

function writeNewProductFlowDraft(draft: NewProductFlowDraft): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(newProductFlowDraftStorageKey, JSON.stringify(draft));
  } catch (error) {
    if (error instanceof DOMException) return;
    throw error;
  }
}

function createScheduleDescription(config: ScheduleTimeConfig) {
  if (!hasCompleteScheduleTimeConfig(config)) {
    return "Sem horários definidos, sem capacidade atribuída.";
  }

  return `${config.startTime} (início) - ${config.endTime} (fim), ${config.maximumCapacity} vagas (máxima) - ${config.minimumCapacity} vagas (mínima).`;
}

function createRouteDayDescription(config: RouteDayConfig) {
  if (!hasRouteDayConfig(config)) {
    return "Sem horários definidos, sem produto selecionado, sem capacidade atribuída.";
  }

  const scheduleLabel =
    config.startTime && config.endTime ? `${config.startTime} - ${config.endTime}` : "Sem horário";
  const productLabel = config.product.trim() || "sem produto selecionado";
  const requiredLabel = config.required ? "obrigatório" : "opcional";
  const priceLabel = config.includedInPrice
    ? "incluso no preço"
    : `R$ ${config.price.trim() || "0,00"} (por pessoa)`;

  return `${scheduleLabel}, ${productLabel} (produto), ${requiredLabel}, ${priceLabel}.`;
}

function createProductPeriodDescription(config: ProductPeriodConfig) {
  if (!hasProductPeriodConfig(config)) {
    return "Sem períodos definidos, sem dias de funcionamento definidos";
  }

  const startDate = config.startDate.trim();
  const endDate = config.endDate.trim();
  const dateLabel = startDate
    ? `${startDate} ${
        config.hasIndefiniteEndDate ? "- prazo indeterminado" : `a ${endDate || "sem fim definido"}`
      }`
    : "Sem período definido";
  const selectedModes = productPeriodFunctionModeOptions.filter((option) =>
    config.functionModes.includes(option.id)
  );
  const selectedCustomDays = productPeriodWeekdayOptions.filter(
    (option) => config.customDaySchedules[option.id].enabled
  );
  const modeLabels = selectedModes.map((option) => {
    if (option.id !== "custom") return option.summaryLabel;

    const customDaysLabel = selectedCustomDays.map((weekday) => weekday.label).join(", ");
    return customDaysLabel ? `${option.summaryLabel}: ${customDaysLabel}` : option.summaryLabel;
  });
  const weekdaysLabel =
    modeLabels.length > 0 ? modeLabels.join(", ") : "sem dias de funcionamento definidos";

  return `${dateLabel}, ${weekdaysLabel}.`;
}

function createItemDescription(config: ItemConfig) {
  if (!hasItemConfig(config)) {
    return "Sem item cadastrado, sem valor definido, sem limite por dia.";
  }

  const typeLabel = config.included ? "Item incluso na compra" : "Item opcional";
  const availabilityLabel = config.useItemStock
    ? "usa estoque do item"
    : `${config.dailyLimit.trim() || "0"} (limite por dia)`;
  const valueLabel = config.complimentary
    ? "cortesia"
    : `${config.value.trim() || "R$ 0,00"} (valor do item)`;

  return `${typeLabel}, ${availabilityLabel}, ${valueLabel}.`;
}

const variablePricingRuleKindLabels: Record<VariablePricingRuleKind, string> = {
  ageRange: "Por faixa etária",
  specialProfile: "Perfil especial",
  accommodation: "Por acomodação",
  dayType: "Por tipo de dia",
  seatBatch: "Por lote de vagas",
  custom: "Personalizada",
};

function hasVariablePricingRuleConfig(rule: VariablePricingRule) {
  return Boolean(
    rule.kind !== "ageRange" ||
    rule.title.trim() ||
    rule.value.trim() ||
    rule.stockMode !== "productStock" ||
    rule.customStockMinimum.trim() ||
    rule.customStockNoMinimum ||
    rule.customStock.trim() ||
    rule.validFrom.trim() ||
    rule.validUntil.trim() ||
    rule.startTime.trim() ||
    rule.endTime.trim() ||
    !rule.indefiniteValidity ||
    rule.linkedRules.length > 0
  );
}

function createVariablePricingLinkedRuleTitle(rule: VariablePricingLinkedRule, index: number) {
  return rule.title.trim() || `Subregra #${index + 1}`;
}

function createVariablePricingLinkedRuleDescription(rule: VariablePricingLinkedRule) {
  const valueLabel = rule.value.trim() ? `R$ ${rule.value.trim()}` : "sem valor definido";
  return `${variablePricingRuleKindLabels[rule.kind]} · ${valueLabel}`;
}

function createVariablePricingRuleDescription(rule: VariablePricingRule) {
  if (!hasVariablePricingRuleConfig(rule)) return "Sem regras definidas";

  const kindLabel = variablePricingRuleKindLabels[rule.kind];
  const titleLabel = rule.title.trim() || "sem título";
  const valueLabel = rule.value.trim() ? `R$ ${rule.value.trim()}` : "sem valor definido";
  const stockLabel =
    rule.stockMode === "productStock"
      ? "estoque do produto"
      : `${rule.customStock.trim() || "0"} vagas próprias`;
  const linkedRulesLabel =
    rule.linkedRules.length === 0
      ? ""
      : `, ${rule.linkedRules.length} ${
          rule.linkedRules.length === 1 ? "subregra vinculada" : "subregras vinculadas"
        }`;

  return `${kindLabel}, ${titleLabel}, ${valueLabel}, ${stockLabel}${linkedRulesLabel}.`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function createProductUrlSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getVariablePricingStockLimitHint(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  const quantity = Number(trimmedValue);
  if (!Number.isFinite(quantity) || quantity <= variablePricingProductStockCapacity) return null;

  return `Maior que o estoque disponível (${variablePricingProductStockLabel}).`;
}

function formatCurrencyInput(value: string) {
  const sanitized = value.replace(/[^\d,]/g, "");
  const [integerPart = "", decimalPart] = sanitized.split(",", 2);
  const formattedIntegerPart = formatIntegerInput(integerPart);

  if (decimalPart === undefined) return formattedIntegerPart;

  return `${formattedIntegerPart},${onlyDigits(decimalPart).slice(0, 2)}`;
}

function formatPercentInput(value: string) {
  const sanitized = value.replace(/[^\d,.%]/g, "");
  const numericPart = sanitized.replace(/%/g, "");
  return sanitized.includes("%") ? `${numericPart}%` : numericPart;
}

function formatIntegerInput(value: string) {
  return onlyDigits(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseDecimalInput(value: string) {
  const normalized = value
    .replace(/[^\d,.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrencyPreview(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function clampNumber(value: string, min: number, max: number) {
  return Math.min(Math.max(Number(value), min), max);
}

function formatTwoDigitNumber(value: number) {
  return value.toString().padStart(2, "0");
}

function isLeapYear(year: number) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function getDaysInMonth(month: number, year?: number) {
  if (month === 2) return year ? (isLeapYear(year) ? 29 : 28) : 29;
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  return 31;
}

function formatDateInput(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length < 2) return digits;
  if (digits.length < 4) {
    const day = formatTwoDigitNumber(clampNumber(digits.slice(0, 2), 1, 31));
    if (digits.length === 2) return `${day}/`;
    return `${day}/${digits.slice(2)}`;
  }

  const month = clampNumber(digits.slice(2, 4), 1, 12);
  const yearDigits = digits.slice(4);
  const normalizedYear =
    yearDigits.length === 4
      ? Math.max(Number(yearDigits), new Date().getFullYear()).toString()
      : yearDigits;
  const yearForDay = normalizedYear.length === 4 ? Number(normalizedYear) : undefined;
  const day = formatTwoDigitNumber(
    clampNumber(digits.slice(0, 2), 1, getDaysInMonth(month, yearForDay))
  );
  const formattedMonth = formatTwoDigitNumber(month);

  if (digits.length === 4) return `${day}/${formattedMonth}/`;

  return `${day}/${formattedMonth}/${normalizedYear}`;
}

function formatTimeInput(value: string) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length < 2) return digits;
  if (digits.length === 2) return Math.min(Number(digits), 23).toString().padStart(2, "0");

  const hours = Math.min(Number(digits.slice(0, 2)), 23)
    .toString()
    .padStart(2, "0");
  const minutesDigits = digits.slice(2);

  if (minutesDigits.length === 1) {
    const minutesTens = Math.min(Number(minutesDigits), 5);
    return `${hours}:${minutesTens}`;
  }

  const minutes = Math.min(Number(minutesDigits), 59).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getRouteDayReorderTargetIndex({
  sourceIndex,
  currentClientY,
  cardCentersY,
}: {
  readonly sourceIndex: number;
  readonly currentClientY: number;
  readonly cardCentersY: readonly number[];
}) {
  if (cardCentersY.length === 0) return sourceIndex;

  return cardCentersY.reduce((targetIndex, centerY, index) => {
    const previousCenterY = cardCentersY[index - 1];
    const nextCenterY = cardCentersY[index + 1];
    const topBoundary =
      previousCenterY === undefined ? Number.NEGATIVE_INFINITY : (previousCenterY + centerY) / 2;
    const bottomBoundary =
      nextCenterY === undefined ? Number.POSITIVE_INFINITY : (centerY + nextCenterY) / 2;

    if (currentClientY >= topBoundary && currentClientY < bottomBoundary) return index;

    return targetIndex;
  }, sourceIndex);
}

function hasScheduleTimeConfig(config: ScheduleTimeConfig) {
  return Boolean(
    config.startTime || config.endTime || config.minimumCapacity || config.maximumCapacity
  );
}

function hasCompleteScheduleTimeConfig(config: ScheduleTimeConfig) {
  return Boolean(
    config.startTime && config.endTime && config.minimumCapacity && config.maximumCapacity
  );
}

function createProgramSummary(
  contractMode: ProductContractMode,
  operatingMode: ProductOperatingMode
) {
  if (contractMode === "eventOnly") return "Apenas com evento";
  if (operatingMode === "specificPeriods") return "Períodos específicos";
  return "Todos os dias";
}

function createDeparturesSummary(scheduleSlots: readonly ScheduleTimeSlot[]) {
  const configuredDepartures = scheduleSlots.filter((slot) => hasScheduleTimeConfig(slot.config));
  return configuredDepartures.length > 0 ? String(configuredDepartures.length) : "Não preenchido";
}

function createCapacitySummary(
  maximumParticipants: string,
  scheduleSlots: readonly ScheduleTimeSlot[]
) {
  const participantCapacity = maximumParticipants.trim();
  if (participantCapacity) return `${participantCapacity} pax`;

  const capacities = Array.from(
    new Set(
      scheduleSlots
        .map((slot) => slot.config.maximumCapacity.trim())
        .filter((capacity) => capacity.length > 0)
    )
  );

  if (capacities.length === 0) return "Não preenchida";
  if (capacities.length === 1) return `${capacities[0]} pax / saída`;
  return `${capacities.join(", ")} pax / saída`;
}

function createPromotionPreviewValue(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue || parseDecimalInput(trimmedValue) <= 0) return null;
  return `R$ ${trimmedValue}`;
}

function hasRouteDayConfig(config: RouteDayConfig) {
  return Boolean(
    config.startTime || config.endTime || config.title || config.product || config.price
  );
}

function hasProductPeriodConfig(config: ProductPeriodConfig) {
  const hasCustomDaySchedule = productPeriodWeekdayOptions.some((option) => {
    const schedule = config.customDaySchedules[option.id];
    return (
      schedule.enabled ||
      schedule.startTime !== emptyProductPeriodDaySchedule.startTime ||
      schedule.endTime !== emptyProductPeriodDaySchedule.endTime
    );
  });

  return Boolean(
    config.startDate.trim() ||
    config.endDate.trim() ||
    config.hasIndefiniteEndDate ||
    config.functionModes.length > 0 ||
    hasCustomDaySchedule
  );
}

function hasItemConfig(config: ItemConfig) {
  return Boolean(
    config.item.trim() ||
    config.value.trim() ||
    config.dailyLimit.trim() ||
    config.complimentary ||
    config.useItemStock ||
    !config.included
  );
}

function hasNewProductFormChanges(form: ProdutoFormState) {
  return Boolean(
    form.nome.trim() ||
    form.preco.trim() ||
    form.duracao.trim() ||
    form.capacidade.trim() ||
    form.descricao.trim() ||
    form.pontoEncontro.trim() ||
    form.destaque ||
    form.categoria !== "Trilha" ||
    form.tipo !== "Atividade" ||
    form.status !== "Rascunho"
  );
}

function areCommunicationChannelsEqual(
  left: ReadonlySet<CommunicationChannel>,
  right: readonly CommunicationChannel[]
) {
  return left.size === right.length && right.every((channel) => left.has(channel));
}

function areSalesChannelsEqual(left: ReadonlySet<SalesChannel>, right: readonly SalesChannel[]) {
  return left.size === right.length && right.every((channel) => left.has(channel));
}

function arePaymentMethodsEqual(
  left: ReadonlySet<PaymentMethodId>,
  right: readonly PaymentMethodId[]
) {
  return left.size === right.length && right.every((method) => left.has(method));
}

function areAdvancedStockTogglesEqual(
  left: Record<AdvancedStockToggleId, boolean>,
  right: Record<AdvancedStockToggleId, boolean>
) {
  return advancedStockToggleOptions.every((option) => left[option.id] === right[option.id]);
}

function areConfigsEqual<T>(left: readonly T[], right: readonly T[]) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function createEmptyProductPeriodConfig(order: number): ProductPeriodConfig {
  return {
    ...emptyProductPeriodConfig,
    id: `product-period-${order}`,
  };
}

function createEmptyMeetingPointConfig(order: number): MeetingPointConfig {
  return {
    id: `meeting-point-${order}`,
    name: "",
    mapLink: "",
  };
}

function getNextMeetingPointOrder(configs: readonly MeetingPointConfig[]) {
  return (
    configs.reduce((highestOrder, config) => {
      const order = Number(config.id.replace("meeting-point-", ""));
      return Number.isInteger(order) && order > highestOrder ? order : highestOrder;
    }, 1) + 1
  );
}

function getNextProductPeriodOrder(configs: readonly ProductPeriodConfig[]) {
  return (
    configs.reduce((highestOrder, config) => {
      const order = Number(config.id.replace("product-period-", ""));
      return Number.isInteger(order) && order > highestOrder ? order : highestOrder;
    }, 0) + 1
  );
}

function createEmptyScheduleTimeSlot(order: number): ScheduleTimeSlot {
  return {
    id: `schedule-time-${order}`,
    order,
    status: "Inativo",
    config: emptyScheduleTimeConfig,
  };
}

function getScheduleStartMinutes(config: ScheduleTimeConfig) {
  const [hoursValue, minutesValue] = config.startTime.split(":");
  const hours = Number(hoursValue);
  const minutes = Number(minutesValue);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return -1;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return -1;
  }

  return hours * 60 + minutes;
}

function orderScheduleTimeSlots(slots: readonly ScheduleTimeSlot[]) {
  return [...slots].sort((firstSlot, secondSlot) => {
    const firstStart = getScheduleStartMinutes(firstSlot.config);
    const secondStart = getScheduleStartMinutes(secondSlot.config);

    if (firstStart !== secondStart) {
      return secondStart - firstStart;
    }

    return firstSlot.order - secondSlot.order;
  });
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function VirtualizedLocationSelect({
  label,
  value,
  options,
  onValueChange,
  placeholder,
  disabled = false,
}: {
  readonly label: string;
  readonly value: string | undefined;
  readonly options: readonly LocationSelectOption[];
  readonly onValueChange: (value: string) => void;
  readonly placeholder: string;
  readonly disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );
  const virtualWindow = getVirtualWindow({
    itemCount: options.length,
    itemHeight: virtualOptionHeight,
    viewportHeight: virtualListHeight,
    scrollTop,
    overscan: virtualOptionOverscan,
  });
  const visibleOptions = useMemo(
    () => options.slice(virtualWindow.startIndex, virtualWindow.endIndex),
    [options, virtualWindow.endIndex, virtualWindow.startIndex]
  );

  useEffect(() => {
    if (!open) return;

    setScrollTop(0);
  }, [open, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          disabled={disabled}
          className={locationSelectTriggerClass}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            setOpen(true);
          }}
        >
          <span className="min-w-0 truncate">{selectedOption?.label ?? placeholder}</span>
          <HugeiconsIcon
            icon={UnfoldMoreIcon}
            size={16}
            strokeWidth={2}
            className="text-muted-foreground pointer-events-none shrink-0"
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
        className="ring-foreground/5 gap-0 overflow-hidden rounded-md border border-[#e9eaeb] bg-white p-0 shadow-lg ring-1"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div
          role="listbox"
          aria-label={label}
          className="overflow-x-hidden overflow-y-auto p-1.5"
          style={{ maxHeight: virtualListHeight }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[#717680]">Nenhuma cidade disponível</p>
          ) : (
            <>
              {virtualWindow.beforeHeight > 0 && (
                <div style={{ height: virtualWindow.beforeHeight }} />
              )}
              {visibleOptions.map((option) => {
                const selected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className="relative flex h-9 w-full cursor-default items-center gap-2 rounded-sm py-2 pr-8 pl-3 text-left font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27] outline-hidden transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc]"
                    onClick={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <span className="min-w-0 truncate">{option.label}</span>
                    {selected && (
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={14}
                        strokeWidth={1.5}
                        className="text-primary pointer-events-none absolute right-3"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
              {virtualWindow.afterHeight > 0 && (
                <div style={{ height: virtualWindow.afterHeight }} />
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`font-['Helvetica_Neue:Medium',sans-serif] text-[11px] leading-[16.5px] tracking-[0.8px] text-[#a4a7ae] uppercase ${className}`}
    >
      {children}
    </p>
  );
}

function ProductEventOnlyNotice() {
  return (
    <InfoCallout>
      Este produto só fica disponível para reserva nas datas cadastradas como eventos na agenda.
      Cadastrar as datas é obrigatório: sem eventos criados, nada é vendido. É no cadastro de cada
      data que o valor do produto e dos itens vinculados pode ser ajustado, então o mesmo produto
      pode ter preços diferentes por data.
    </InfoCallout>
  );
}

function ProductSpecificPeriodsNotice() {
  return (
    <InfoCallout>
      Cadastre os períodos e os dias em que o produto funciona. Dentro do período vale a regra
      cadastrada; depois do fim do período, o produto volta a funcionar todos os dias.
    </InfoCallout>
  );
}

function ItemSumBillingNotice({ onGoToItems }: { readonly onGoToItems: () => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-[13px] pt-[9px] pb-[11px]">
      <div className="flex items-center gap-2.5">
        <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
          <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
          <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[14px] text-[#414651]">
          O preço deste produto é a soma dos itens escolhidos pelo cliente. Configure os itens e
          seus valores na área de Itens do produto, logo acima.
        </p>
      </div>
      <button
        type="button"
        className="ml-[34px] flex h-5 w-fit items-center gap-1.5 rounded-[10px] bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#0b5ed7] transition-colors hover:text-[#084fb7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
        onClick={onGoToItems}
      >
        Ir para Itens do produto
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 13.3337H4.26667C6.50688 13.3337 7.62698 13.3337 8.48263 12.8977C9.23528 12.5142 9.8472 11.9023 10.2307 11.1496C10.6667 10.294 10.6667 9.17387 10.6667 6.93366L10.6667 2.66699M14 6.00033L10.6667 2.66699L7.33333 6.00033"
            stroke="#0B5ED7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

function SectionCard({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`produto-${id}`}
      className="scroll-mt-6 rounded-[16px] border border-[#e9eaeb] bg-white shadow-sm"
    >
      <div className="border-b border-[#f5f5f5] px-6 pt-6 pb-3">
        <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-base leading-[normal] text-[#181d27]">
          {title}
        </h2>
        <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#737373]">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-5 px-6 pt-4 pb-4">{children}</div>
    </section>
  );
}

function ToggleLine({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="min-w-0">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">{title}</p>
        <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[14px] text-[#717680]">
          {description}
        </p>
      </div>
      <Switch aria-label={title} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ParticipantDataFieldButton({
  icon,
  iconNode,
  label,
  selected,
  onClick,
}: {
  readonly icon?: HugeIconData;
  readonly iconNode?: ReactNode;
  readonly label: string;
  readonly selected: boolean;
  readonly onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-[46px] min-w-0 items-center gap-2.5 rounded-[12px] border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none ${
        selected
          ? "border-[1.2px] border-[#1b71fd] bg-[#eff6ff] text-[#0b5ed7]"
          : "border-[#e5e7eb] bg-white text-[#535862] hover:bg-[#f8fafc]"
      }`}
    >
      {iconNode ??
        (icon ? (
          <HugeiconsIcon icon={icon} size={20} strokeWidth={1.5} aria-hidden="true" />
        ) : null)}
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}

function ParticipantHealthPlanIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M10 3.75V5M10 5V6.25M10 5L11.25 5M10 5H8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.1549 2.15515C6.66675 2.6433 6.66675 3.42898 6.66675 5.00033C6.66675 6.57167 6.66675 7.35735 7.1549 7.8455C7.64306 8.33366 8.42873 8.33366 10.0001 8.33366C11.5714 8.33366 12.3571 8.33366 12.8453 7.8455C13.3334 7.35735 13.3334 6.57167 13.3334 5.00033C13.3334 3.42898 13.3334 2.6433 12.8453 2.15515C12.3571 1.66699 11.5714 1.66699 10.0001 1.66699C8.42873 1.66699 7.64306 1.66699 7.1549 2.15515Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33325 18.3337L3.33325 9.97593C3.33325 7.21802 3.33325 5.83907 4.18752 4.98229C4.73046 4.43776 5.48371 4.23932 6.66659 4.16699M16.6666 18.3337L16.6666 9.97593C16.6666 7.21802 16.6666 5.83907 15.8123 4.98229C15.2694 4.43776 14.5161 4.23932 13.3333 4.16699"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 18.333L17.5 18.333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.91675 18.3337V16.2503C7.91675 15.4715 7.91675 15.0821 8.08422 14.792C8.19393 14.602 8.35172 14.4442 8.54175 14.3345C8.83181 14.167 9.22123 14.167 10.0001 14.167C10.7789 14.167 11.1684 14.167 11.4584 14.3345C11.6484 14.4442 11.8062 14.602 11.9159 14.792C12.0834 15.0821 12.0834 15.4715 12.0834 16.2503V18.3337"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.67422 10.833H6.66675M10.0001 10.833H9.99261M13.3344 10.833H13.3269"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ParticipantAllergyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M18.75 9.1748H14.6965C14.6965 10.4285 14.2038 11.6308 13.3267 12.5173C12.4496 13.4037 11.2599 13.9017 10.0195 13.9017C8.77905 13.9017 7.58943 13.4037 6.71231 12.5173C5.83519 11.6308 5.34243 10.4285 5.34243 9.1748H1.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.95261 10.6737C7.40441 10.1196 7.09644 9.36817 7.09644 8.58463C7.1691 7.28762 7.49907 6.01861 8.06673 4.85306C8.63438 3.6875 9.42813 2.64921 10.4008 1.7999C10.4945 1.72272 10.6095 1.67677 10.7301 1.66839C10.8507 1.66 10.9708 1.68959 11.0741 1.75309C11.1773 1.81658 11.2586 1.91085 11.3066 2.02293C11.3547 2.13502 11.3672 2.2594 11.3424 2.37895C10.6533 5.78944 12.9428 6.49296 12.9428 8.58463C12.9428 9.36817 12.6348 10.1196 12.0866 10.6737C11.5384 11.2277 10.7949 11.539 10.0196 11.539C9.24433 11.539 8.50081 11.2277 7.95261 10.6737Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.62883 18.247C1.68365 18.3024 1.758 18.3335 1.83553 18.3335C1.91306 18.3335 1.98741 18.3024 2.04223 18.247C2.09705 18.1916 2.12785 18.1164 2.12785 18.0381C2.12785 17.9597 2.09705 17.8846 2.04223 17.8292C1.98741 17.7738 1.91306 17.7427 1.83553 17.7427C1.758 17.7427 1.68365 17.7738 1.62883 17.8292C1.57401 17.8846 1.54321 17.9597 1.54321 18.0381C1.54321 18.1164 1.57401 18.1916 1.62883 18.247Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.89052 18.247C6.94534 18.3024 7.01969 18.3335 7.09722 18.3335C7.17475 18.3335 7.2491 18.3024 7.30392 18.247C7.35874 18.1916 7.38954 18.1164 7.38954 18.0381C7.38954 17.9597 7.35874 17.8846 7.30392 17.8292C7.2491 17.7738 7.17475 17.7427 7.09722 17.7427C7.01969 17.7427 6.94534 17.7738 6.89052 17.8292C6.8357 17.8846 6.80491 17.9597 6.80491 18.0381C6.80491 18.1164 6.8357 18.1916 6.89052 18.247Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12.7368 18.247C12.7917 18.3024 12.866 18.3335 12.9435 18.3335C13.0211 18.3335 13.0954 18.3024 13.1502 18.247C13.2051 18.1916 13.2359 18.1164 13.2359 18.0381C13.2359 17.9597 13.2051 17.8846 13.1502 17.8292C13.0954 17.7738 13.0211 17.7427 12.9435 17.7427C12.866 17.7427 12.7917 17.7738 12.7368 17.8292C12.682 17.8846 12.6512 17.9597 12.6512 18.0381C12.6512 18.1164 12.682 18.1916 12.7368 18.247Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17.9985 18.247C18.0534 18.3024 18.1277 18.3335 18.2052 18.3335C18.2828 18.3335 18.3571 18.3024 18.4119 18.247C18.4668 18.1916 18.4976 18.1164 18.4976 18.0381C18.4976 17.9597 18.4668 17.8846 18.4119 17.8292C18.3571 17.7738 18.2828 17.7427 18.2052 17.7427C18.1277 17.7427 18.0534 17.7738 17.9985 17.8292C17.9437 17.8846 17.9129 17.9597 17.9129 18.0381C17.9129 18.1164 17.9437 18.1916 17.9985 18.247Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17.9985 12.3383C18.0534 12.3937 18.1277 12.4249 18.2052 12.4249C18.2828 12.4249 18.3571 12.3937 18.4119 12.3383C18.4668 12.2829 18.4976 12.2078 18.4976 12.1294C18.4976 12.0511 18.4668 11.9759 18.4119 11.9205C18.3571 11.8651 18.2828 11.834 18.2052 11.834C18.1277 11.834 18.0534 11.8651 17.9985 11.9205C17.9437 11.9759 17.9129 12.0511 17.9129 12.1294C17.9129 12.2078 17.9437 12.2829 17.9985 12.3383Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.66 15.2927C15.7148 15.3481 15.7892 15.3792 15.8667 15.3792C15.9442 15.3792 16.0186 15.3481 16.0734 15.2927C16.1282 15.2373 16.159 15.1621 16.159 15.0838C16.159 15.0054 16.1282 14.9303 16.0734 14.8749C16.0186 14.8194 15.9442 14.7883 15.8667 14.7883C15.7892 14.7883 15.7148 14.8194 15.66 14.8749C15.6052 14.9303 15.5744 15.0054 15.5744 15.0838C15.5744 15.1621 15.6052 15.2373 15.66 15.2927Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.96736 15.2927C4.02218 15.3481 4.09653 15.3792 4.17406 15.3792C4.25159 15.3792 4.32594 15.3481 4.38076 15.2927C4.43558 15.2373 4.46638 15.1621 4.46638 15.0838C4.46638 15.0054 4.43558 14.9303 4.38076 14.8749C4.32594 14.8194 4.25159 14.7883 4.17406 14.7883C4.09653 14.7883 4.02218 14.8194 3.96736 14.8749C3.91254 14.9303 3.88174 15.0054 3.88174 15.0838C3.88174 15.1621 3.91254 15.2373 3.96736 15.2927Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M1.62883 12.3383C1.68365 12.3937 1.758 12.4249 1.83553 12.4249C1.91306 12.4249 1.98741 12.3937 2.04223 12.3383C2.09705 12.2829 2.12785 12.2078 2.12785 12.1294C2.12785 12.0511 2.09705 11.9759 2.04223 11.9205C1.98741 11.8651 1.91306 11.834 1.83553 11.834C1.758 11.834 1.68365 11.8651 1.62883 11.9205C1.57401 11.9759 1.54321 12.0511 1.54321 12.1294C1.54321 12.2078 1.57401 12.2829 1.62883 12.3383Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function isValidEditorHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function applyInlineStyleToEditorSelection(
  editorElement: HTMLDivElement,
  applyStyle: (style: CSSStyleDeclaration) => void
) {
  editorElement.focus();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (!editorElement.contains(range.commonAncestorContainer) || range.collapsed) return false;

  const span = document.createElement("span");
  applyStyle(span.style);
  span.appendChild(range.extractContents());
  range.insertNode(span);

  const nextRange = document.createRange();
  nextRange.selectNodeContents(span);
  selection.removeAllRanges();
  selection.addRange(nextRange);

  return true;
}

function removeBackgroundColorFromEditorContent(editorElement: HTMLElement) {
  let didRemoveBackgroundColor = false;
  const styledElements = [editorElement, ...editorElement.querySelectorAll<HTMLElement>("[style]")];

  for (const element of styledElements) {
    if (!element.style.backgroundColor) continue;

    element.style.removeProperty("background-color");
    didRemoveBackgroundColor = true;

    if (element.getAttribute("style")?.trim() === "") {
      element.removeAttribute("style");
    }
  }

  return didRemoveBackgroundColor;
}

type EditorLinkConfig = {
  readonly displayText: string;
  readonly url: string;
  readonly openInNewWindow: boolean;
};

type EditorKeyboardShortcutAction =
  | { readonly kind: "command"; readonly command: string }
  | { readonly kind: "link" };

function getEditorToolbarTooltipLabel(ariaLabel: string) {
  const templateContextIndex = ariaLabel.indexOf(" em ");
  if (templateContextIndex !== -1) {
    return ariaLabel.slice(0, templateContextIndex);
  }

  const contextSuffix = editorToolbarTooltipContextSuffixes.find((suffix) =>
    ariaLabel.endsWith(suffix)
  );
  return contextSuffix ? ariaLabel.slice(0, -contextSuffix.length) : ariaLabel;
}

function normalizeEditorEmojiText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getEditorEmojiSearchValue(item: EditorEmojiItem) {
  return normalizeEditorEmojiText(`${item.emoji} ${item.name} ${item.keywords.join(" ")}`);
}

function getEditorEmojiByValue(emoji: string): EditorEmojiItem | undefined {
  return editorEmojiItems.find((item) => item.emoji === emoji);
}

function recordRecentEditorEmoji(currentEmojis: readonly string[], emoji: string) {
  return [emoji, ...currentEmojis.filter((currentEmoji) => currentEmoji !== emoji)].slice(0, 24);
}

function getEditorKeyboardShortcutAction(
  event: KeyboardEvent<HTMLDivElement>
): EditorKeyboardShortcutAction | null {
  if (!(event.ctrlKey || event.metaKey) || event.altKey) return null;

  const key = event.key.toLowerCase();
  if (!event.shiftKey) {
    if (key === "b") return { kind: "command", command: "bold" };
    if (key === "i") return { kind: "command", command: "italic" };
    if (key === "u") return { kind: "command", command: "underline" };
    if (key === "k") return { kind: "link" };
    return null;
  }

  if (key === "l") return { kind: "command", command: "justifyLeft" };
  if (key === "e") return { kind: "command", command: "justifyCenter" };
  if (key === "x") return { kind: "command", command: "strikeThrough" };
  if (event.code === "Digit8" || key === "8") {
    return { kind: "command", command: "insertUnorderedList" };
  }
  if (event.code === "Digit7" || key === "7") {
    return { kind: "command", command: "insertOrderedList" };
  }

  return null;
}

function getEditorSelectionRange(editorElement: HTMLDivElement | null) {
  if (!editorElement) return null;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!editorElement.contains(range.commonAncestorContainer)) return null;

  return range.cloneRange();
}

function restoreEditorSelection(range: Range) {
  const selection = window.getSelection();
  if (!selection) return;

  selection.removeAllRanges();
  selection.addRange(range);
}

function createEditorLinkHtml({ displayText, url, openInNewWindow }: EditorLinkConfig) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.textContent = displayText;
  if (openInNewWindow) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }

  return anchor.outerHTML;
}

function useEditorLinkControl(
  editorRef: RefObject<HTMLDivElement | null>,
  syncEditorHtml: () => void
) {
  const savedSelectionRangeRef = useRef<Range | null>(null);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const handleLinkPopoverOpenChange = useCallback(
    (open: boolean) => {
      savedSelectionRangeRef.current = open ? getEditorSelectionRange(editorRef.current) : null;
      setIsLinkPopoverOpen(open);
    },
    [editorRef]
  );

  const handleInsertLink = useCallback(
    (link: EditorLinkConfig) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const savedRange = savedSelectionRangeRef.current;
      if (savedRange && editorElement.contains(savedRange.commonAncestorContainer)) {
        restoreEditorSelection(savedRange);
      }

      editorElement.focus();
      document.execCommand("insertHTML", false, createEditorLinkHtml(link));
      savedSelectionRangeRef.current = null;
      setIsLinkPopoverOpen(false);
      syncEditorHtml();
    },
    [editorRef, syncEditorHtml]
  );

  return {
    handleInsertLink,
    handleLinkPopoverOpenChange,
    isLinkPopoverOpen,
  };
}

function useEditorEmojiControl(
  editorRef: RefObject<HTMLDivElement | null>,
  syncEditorHtml: () => void
) {
  const savedSelectionRangeRef = useRef<Range | null>(null);
  const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<readonly string[]>([]);

  const handleEmojiPopoverOpenChange = useCallback(
    (open: boolean) => {
      savedSelectionRangeRef.current = open ? getEditorSelectionRange(editorRef.current) : null;
      setIsEmojiPopoverOpen(open);
    },
    [editorRef]
  );

  const handleSelectEmoji = useCallback(
    (emoji: string) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const savedRange = savedSelectionRangeRef.current;
      if (savedRange && editorElement.contains(savedRange.commonAncestorContainer)) {
        restoreEditorSelection(savedRange);
      }

      editorElement.focus();
      document.execCommand("insertText", false, emoji);
      savedSelectionRangeRef.current = null;
      setRecentEmojis((currentEmojis) => recordRecentEditorEmoji(currentEmojis, emoji));
      setIsEmojiPopoverOpen(false);
      syncEditorHtml();
    },
    [editorRef, syncEditorHtml]
  );

  return {
    handleEmojiPopoverOpenChange,
    handleSelectEmoji,
    isEmojiPopoverOpen,
    recentEmojis,
  };
}

type EditorListKind = "ordered" | "unordered";

function createEditorListElement(kind: EditorListKind, itemTexts: readonly string[]) {
  const list = kind === "ordered" ? document.createElement("ol") : document.createElement("ul");
  const texts = itemTexts.length > 0 ? itemTexts : [""];

  for (const text of texts) {
    const item = document.createElement("li");
    if (text) {
      item.textContent = text;
    } else {
      item.appendChild(document.createElement("br"));
    }
    list.appendChild(item);
  }

  return list;
}

function moveCursorToEditorListEnd(list: HTMLOListElement | HTMLUListElement) {
  const lastItem = list.lastElementChild;
  const selection = window.getSelection();
  if (!lastItem || !selection) return;

  const range = document.createRange();
  range.selectNodeContents(lastItem);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function getEditorSelectionTexts(selection: Selection | null) {
  if (!selection || selection.isCollapsed) return [];

  return selection
    .toString()
    .split(/\r?\n/)
    .map((text) => text.trim())
    .filter(Boolean);
}

function getEditorTopLevelNode(editorElement: HTMLDivElement, node: Node) {
  let currentNode: Node | null = node;

  while (currentNode?.parentNode && currentNode.parentNode !== editorElement) {
    currentNode = currentNode.parentNode;
  }

  return currentNode?.parentNode === editorElement ? currentNode : null;
}

function getEditorCollapsedListSourceNode(editorElement: HTMLDivElement, range: Range | null) {
  if (!range?.collapsed || !editorElement.contains(range.commonAncestorContainer)) return null;

  if (range.startContainer === editorElement) {
    return editorElement.childNodes.item(range.startOffset);
  }

  return getEditorTopLevelNode(editorElement, range.startContainer);
}

function applyListToEditor(editorElement: HTMLDivElement, kind: EditorListKind) {
  editorElement.focus();

  const command = kind === "ordered" ? "insertOrderedList" : "insertUnorderedList";
  const previousHtml = editorElement.innerHTML;
  const didExecuteCommand =
    typeof document.execCommand === "function" && document.execCommand(command, false);

  if (didExecuteCommand && editorElement.innerHTML !== previousHtml) return;

  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const itemTexts = getEditorSelectionTexts(selection);
  const collapsedSourceNode = getEditorCollapsedListSourceNode(editorElement, range);
  const collapsedSourceText = collapsedSourceNode?.textContent?.trim();
  const list = createEditorListElement(
    kind,
    itemTexts.length > 0 ? itemTexts : collapsedSourceText ? [collapsedSourceText] : []
  );

  if (!range || !editorElement.contains(range.commonAncestorContainer)) {
    editorElement.appendChild(list);
    moveCursorToEditorListEnd(list);
    return;
  }

  if (collapsedSourceNode) {
    collapsedSourceNode.parentNode?.replaceChild(list, collapsedSourceNode);
    moveCursorToEditorListEnd(list);
    return;
  }

  if (!range.collapsed) range.deleteContents();
  range.insertNode(list);
  moveCursorToEditorListEnd(list);
}

type EditorImageResizeState = {
  readonly wrapper: HTMLSpanElement;
  readonly startX: number;
  readonly startWidth: number;
};

const editorImageWrapperSelector = "[data-editor-image-wrapper]";
const editorImageResizeHandleSelector = "[data-editor-image-resize-handle]";
const editorAccordionWrapperSelector = "[data-editor-accordion-wrapper]";
const editorAccordionTitleSelector = "[data-editor-accordion-title]";
const editorAccordionAnswerSelector = "[data-editor-accordion-answer]";
const editorAccordionDeleteButtonSelector = "[data-editor-accordion-delete]";
const editorAccordionReorderHandleSelector = "[data-editor-accordion-reorder-handle]";

function createEditorAccordionReorderIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("color", "currentColor");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("aria-hidden", "true");

  for (const pathData of [
    "M6.00449 6.5V6M7.00449 6.5C7.00449 5.94772 6.55677 5.5 6.00449 5.5C5.4522 5.5 5.00449 5.94772 5.00449 6.5C5.00449 7.05228 5.4522 7.5 6.00449 7.5C6.55677 7.5 7.00449 7.05228 7.00449 6.5Z",
    "M6.00449 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5Z",
    "M6.00449 18.5V18M7.00449 18.5C7.00449 17.9477 6.55677 17.5 6.00449 17.5C5.4522 17.5 5.00449 17.9477 5.00449 18.5C5.00449 19.0523 5.4522 19.5 6.00449 19.5C6.55677 19.5 7.00449 19.0523 7.00449 18.5Z",
    "M18.0045 6.5V6M19.0045 6.5C19.0045 5.94772 18.5568 5.5 18.0045 5.5C17.4522 5.5 17.0045 5.94772 17.0045 6.5C17.0045 7.05228 17.4522 7.5 18.0045 7.5C18.5568 7.5 19.0045 7.05228 19.0045 6.5Z",
    "M18.0045 12.5V12M19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5Z",
    "M12.0045 12.5V12M13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z",
    "M12.0045 6.5V6M13.0045 6.5C13.0045 5.94772 12.5568 5.5 12.0045 5.5C11.4522 5.5 11.0045 5.94772 11.0045 6.5C11.0045 7.05228 11.4522 7.5 12.0045 7.5C12.5568 7.5 13.0045 7.05228 13.0045 6.5Z",
    "M18.0045 18.5V18M19.0045 18.5C19.0045 17.9477 18.5568 17.5 18.0045 17.5C17.4522 17.5 17.0045 17.9477 17.0045 18.5C17.0045 19.0523 17.4522 19.5 18.0045 19.5C18.5568 19.5 19.0045 19.0523 19.0045 18.5Z",
    "M12.0045 18.5V18M13.0045 18.5C13.0045 17.9477 12.5568 17.5 12.0045 17.5C11.4522 17.5 11.0045 17.9477 11.0045 18.5C11.0045 19.0523 11.4522 19.5 12.0045 19.5C12.5568 19.5 13.0045 19.0523 13.0045 18.5Z",
  ] as const) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
  }

  return svg;
}

function createEditorAccordionDeleteIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  for (const pathData of [
    "M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5",
    "M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5",
    "M9.5 16.5L9.5 10.5",
    "M14.5 16.5L14.5 10.5",
  ]) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("stroke-linecap", "round");
    svg.appendChild(path);
  }

  return svg;
}

function createEditorAccordionElement() {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-editor-accordion-wrapper", "true");
  wrapper.setAttribute("contenteditable", "false");
  wrapper.setAttribute(
    "aria-label",
    "Acordeão inserido. Edite o título e a resposta ou selecione o bloco para excluir."
  );
  wrapper.tabIndex = 0;
  wrapper.style.position = "relative";
  wrapper.style.display = "block";
  wrapper.style.margin = "8px 0";
  wrapper.style.border = "1px solid #e9eaeb";
  wrapper.style.borderRadius = "10px";
  wrapper.style.background = "#ffffff";
  wrapper.style.outline = "2px solid transparent";
  wrapper.style.outlineOffset = "2px";
  wrapper.style.boxShadow = "0px 1px 2px rgba(10,13,18,0.05)";

  const title = document.createElement("div");
  title.setAttribute("data-editor-accordion-title", "true");
  title.setAttribute("contenteditable", "true");
  title.setAttribute("role", "textbox");
  title.setAttribute("aria-label", "Título do acordeão");
  title.setAttribute("aria-placeholder", "Título do acordeão");
  title.setAttribute("data-placeholder", "Título do acordeão");
  title.style.minHeight = "40px";
  title.style.borderBottom = "1px solid #f0f1f3";
  title.style.padding = "12px 48px 12px 44px";
  title.style.fontFamily = '"Helvetica Neue:Medium", "Helvetica Neue", sans-serif';
  title.style.fontSize = "14px";
  title.style.lineHeight = "20px";
  title.style.color = "#181d27";
  title.style.outline = "none";

  const answer = document.createElement("div");
  answer.setAttribute("data-editor-accordion-answer", "true");
  answer.setAttribute("contenteditable", "true");
  answer.setAttribute("role", "textbox");
  answer.setAttribute("aria-label", "Resposta do acordeão");
  answer.setAttribute("aria-placeholder", "Escreva a resposta do acordeão aqui.");
  answer.setAttribute("data-placeholder", "Escreva a resposta do acordeão aqui.");
  answer.style.minHeight = "48px";
  answer.style.padding = "12px 14px";
  answer.style.fontFamily = '"Helvetica Neue:Regular", "Helvetica Neue", sans-serif';
  answer.style.fontSize = "13px";
  answer.style.lineHeight = "19.5px";
  answer.style.color = "#535862";
  answer.style.outline = "none";

  const reorderHandle = document.createElement("button");
  reorderHandle.type = "button";
  reorderHandle.setAttribute("data-editor-accordion-reorder-handle", "true");
  reorderHandle.setAttribute("contenteditable", "false");
  reorderHandle.setAttribute("aria-label", "Reordenar acordeão");
  reorderHandle.disabled = true;
  reorderHandle.style.position = "absolute";
  reorderHandle.style.top = "12px";
  reorderHandle.style.left = "12px";
  reorderHandle.style.display = "flex";
  reorderHandle.style.width = "20px";
  reorderHandle.style.height = "20px";
  reorderHandle.style.alignItems = "center";
  reorderHandle.style.justifyContent = "center";
  reorderHandle.style.border = "0";
  reorderHandle.style.borderRadius = "0";
  reorderHandle.style.background = "transparent";
  reorderHandle.style.color = "#d5d7da";
  reorderHandle.style.boxShadow = "none";
  reorderHandle.style.cursor = "not-allowed";
  reorderHandle.style.opacity = "0.55";
  reorderHandle.style.zIndex = "1";
  reorderHandle.appendChild(createEditorAccordionReorderIcon());

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.setAttribute("data-editor-accordion-delete", "true");
  deleteButton.setAttribute("aria-label", "Excluir acordeão");
  deleteButton.setAttribute("contenteditable", "false");
  deleteButton.style.position = "absolute";
  deleteButton.style.top = "8px";
  deleteButton.style.right = "8px";
  deleteButton.style.display = "flex";
  deleteButton.style.width = "32px";
  deleteButton.style.height = "32px";
  deleteButton.style.alignItems = "center";
  deleteButton.style.justifyContent = "center";
  deleteButton.style.border = "1px solid #e2e8f0";
  deleteButton.style.borderRadius = "10px";
  deleteButton.style.background = "#ffffff";
  deleteButton.style.color = "#d92d20";
  deleteButton.style.boxShadow = "none";
  deleteButton.style.cursor = "pointer";
  deleteButton.style.zIndex = "1";
  deleteButton.appendChild(createEditorAccordionDeleteIcon());

  wrapper.append(reorderHandle, title, answer, deleteButton);
  return wrapper;
}

function createEditorImageElement(source: string) {
  const wrapper = document.createElement("span");
  wrapper.setAttribute("data-editor-image-wrapper", "true");
  wrapper.setAttribute("contenteditable", "false");
  wrapper.setAttribute(
    "aria-label",
    "Imagem inserida. Arraste o canto para redimensionar ou pressione Delete para excluir."
  );
  wrapper.tabIndex = 0;
  wrapper.style.display = "inline-block";
  wrapper.style.position = "relative";
  wrapper.style.maxWidth = "100%";
  wrapper.style.minWidth = "80px";
  wrapper.style.verticalAlign = "top";
  wrapper.style.outline = "2px solid transparent";
  wrapper.style.outlineOffset = "2px";
  wrapper.style.borderRadius = "8px";
  wrapper.style.margin = "4px 0";

  const image = document.createElement("img");
  image.src = source;
  image.alt = "";
  image.loading = "lazy";
  image.draggable = false;
  image.style.display = "block";
  image.style.width = "100%";
  image.style.height = "auto";
  image.style.borderRadius = "8px";

  const handle = document.createElement("span");
  handle.setAttribute("data-editor-image-resize-handle", "true");
  handle.setAttribute("aria-hidden", "true");
  handle.style.position = "absolute";
  handle.style.right = "-5px";
  handle.style.bottom = "-5px";
  handle.style.width = "12px";
  handle.style.height = "12px";
  handle.style.borderRadius = "999px";
  handle.style.background = "#0b5ed7";
  handle.style.border = "2px solid #ffffff";
  handle.style.boxShadow = "0 1px 3px rgba(0,0,0,0.18)";
  handle.style.cursor = "nwse-resize";
  handle.style.opacity = "0.75";
  handle.style.transition = "opacity 120ms ease";

  wrapper.append(image, handle);
  return wrapper;
}

function findEditorImageWrapper(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const wrapper = target.closest(editorImageWrapperSelector);
  return wrapper instanceof HTMLSpanElement ? wrapper : null;
}

function findEditorAccordionWrapper(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;

  const wrapper = target.closest(editorAccordionWrapperSelector);
  return wrapper instanceof HTMLDivElement ? wrapper : null;
}

function getEditorTopLevelAccordionWrappers(editorElement: HTMLDivElement) {
  return Array.from(
    editorElement.querySelectorAll<HTMLDivElement>(editorAccordionWrapperSelector)
  ).filter((wrapper) => wrapper.parentElement === editorElement);
}

function updateEditorAccordionReorderButtons(editorElement: HTMLDivElement) {
  const accordionWrappers = getEditorTopLevelAccordionWrappers(editorElement);
  const canReorder = accordionWrappers.length > 1;

  accordionWrappers.forEach((wrapper) => {
    const reorderButton = wrapper.querySelector<HTMLButtonElement>(
      editorAccordionReorderHandleSelector
    );
    if (!reorderButton) return;

    reorderButton.disabled = !canReorder;
    reorderButton.setAttribute("aria-disabled", canReorder ? "false" : "true");
    reorderButton.style.color = canReorder ? "#a4a7ae" : "#d5d7da";
    reorderButton.style.cursor = canReorder ? "grab" : "not-allowed";
    reorderButton.style.opacity = canReorder ? "1" : "0.55";
  });
}

function reorderEditorAccordion(editorElement: HTMLDivElement, accordionWrapper: HTMLDivElement) {
  const accordionWrappers = getEditorTopLevelAccordionWrappers(editorElement);
  if (accordionWrappers.length < 2) return false;

  const currentIndex = accordionWrappers.indexOf(accordionWrapper);
  if (currentIndex < 0) return false;

  const previousWrapper = accordionWrappers[currentIndex - 1];
  if (previousWrapper) {
    editorElement.insertBefore(accordionWrapper, previousWrapper);
    updateEditorAccordionReorderButtons(editorElement);
    return true;
  }

  const nextWrapper = accordionWrappers[currentIndex + 1];
  if (!nextWrapper) return false;

  nextWrapper.after(accordionWrapper);
  updateEditorAccordionReorderButtons(editorElement);
  return true;
}

function findEditorAccordionInsertionBoundary(editorElement: HTMLDivElement, node: Node) {
  const sourceElement = node instanceof Element ? node : node.parentElement;
  const closestWrapper = sourceElement?.closest(editorAccordionWrapperSelector);
  if (!(closestWrapper instanceof HTMLDivElement) || !editorElement.contains(closestWrapper)) {
    return null;
  }

  let boundary = closestWrapper;
  let parentWrapper = boundary.parentElement?.closest(editorAccordionWrapperSelector);
  while (parentWrapper instanceof HTMLDivElement && editorElement.contains(parentWrapper)) {
    boundary = parentWrapper;
    parentWrapper = boundary.parentElement?.closest(editorAccordionWrapperSelector);
  }

  return boundary;
}

function isEditorAccordionEditableArea(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;

  return Boolean(
    target.closest(editorAccordionTitleSelector) || target.closest(editorAccordionAnswerSelector)
  );
}

function setEditorImageSelected(
  editorElement: HTMLDivElement,
  selectedWrapper: HTMLSpanElement | null
) {
  editorElement.querySelectorAll<HTMLSpanElement>(editorImageWrapperSelector).forEach((wrapper) => {
    const isSelected = wrapper === selectedWrapper;
    const handle = wrapper.querySelector<HTMLElement>(editorImageResizeHandleSelector);
    wrapper.toggleAttribute("data-editor-image-selected", isSelected);
    wrapper.style.outlineColor = isSelected ? "#1570ef" : "transparent";
    wrapper.style.boxShadow = isSelected ? "0 0 0 4px rgba(21,112,239,0.12)" : "none";
    if (handle) handle.style.opacity = isSelected ? "1" : "0";
  });
}

function setEditorAccordionSelected(
  editorElement: HTMLDivElement,
  selectedWrapper: HTMLDivElement | null
) {
  editorElement
    .querySelectorAll<HTMLDivElement>(editorAccordionWrapperSelector)
    .forEach((wrapper) => {
      const isSelected = wrapper === selectedWrapper;
      const deleteButton = wrapper.querySelector<HTMLElement>(editorAccordionDeleteButtonSelector);
      wrapper.toggleAttribute("data-editor-accordion-selected", isSelected);
      wrapper.style.outlineColor = isSelected ? "#1570ef" : "transparent";
      wrapper.style.boxShadow = isSelected
        ? "0 0 0 4px rgba(21,112,239,0.12)"
        : "0px 1px 2px rgba(10,13,18,0.05)";
      if (deleteButton) deleteButton.style.display = "flex";
    });
  updateEditorAccordionReorderButtons(editorElement);
}

function getSerializableEditorHtml(editorElement: HTMLDivElement) {
  const clone = editorElement.cloneNode(true);
  if (!(clone instanceof HTMLDivElement)) return editorElement.innerHTML;

  clone.querySelectorAll<HTMLSpanElement>(editorImageWrapperSelector).forEach((wrapper) => {
    const handle = wrapper.querySelector<HTMLElement>(editorImageResizeHandleSelector);
    wrapper.removeAttribute("data-editor-image-selected");
    wrapper.style.outlineColor = "transparent";
    wrapper.style.boxShadow = "none";
    if (handle) handle.style.opacity = "0";
  });

  clone.querySelectorAll<HTMLDivElement>(editorAccordionWrapperSelector).forEach((wrapper) => {
    wrapper.removeAttribute("data-editor-accordion-selected");
    wrapper.style.outlineColor = "transparent";
    wrapper.style.boxShadow = "0px 1px 2px rgba(10,13,18,0.05)";
  });
  clone
    .querySelectorAll<HTMLButtonElement>(editorAccordionDeleteButtonSelector)
    .forEach((button) => {
      button.remove();
    });
  clone.querySelectorAll<HTMLElement>(editorAccordionReorderHandleSelector).forEach((handle) => {
    handle.remove();
  });

  return clone.innerHTML;
}

function hasSerializableEditorContent(source: string) {
  if (!source.trim()) return false;

  const template = document.createElement("template");
  template.innerHTML = source;
  if (template.content.querySelector("img")) return true;

  return Boolean((template.content.textContent ?? "").replace(/\u00a0/g, " ").trim());
}

function insertEditorElement(editorElement: HTMLDivElement, element: HTMLElement) {
  editorElement.focus();

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (editorElement.contains(range.commonAncestorContainer)) {
      const accordionBoundary = findEditorAccordionInsertionBoundary(
        editorElement,
        range.commonAncestorContainer
      );
      if (accordionBoundary) {
        accordionBoundary.after(element);
        const nextRange = document.createRange();
        nextRange.setStartAfter(element);
        nextRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(nextRange);
        return;
      }

      range.deleteContents();
      range.insertNode(element);
      range.setStartAfter(element);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
  }

  editorElement.appendChild(element);
}

function insertImageIntoEditor(editorElement: HTMLDivElement, source: string) {
  insertEditorElement(editorElement, createEditorImageElement(source));
}

function insertAccordionIntoEditor(editorElement: HTMLDivElement) {
  insertEditorElement(editorElement, createEditorAccordionElement());
  updateEditorAccordionReorderButtons(editorElement);
}

function useEditorEmbeddedElementControls(
  editorRef: { readonly current: HTMLDivElement | null },
  syncEditorHtml: () => void
) {
  const selectedImageRef = useRef<HTMLSpanElement | null>(null);
  const selectedAccordionRef = useRef<HTMLDivElement | null>(null);
  const resizeStateRef = useRef<EditorImageResizeState | null>(null);
  const ignoreNextClickRef = useRef(false);

  const selectImage = useCallback(
    (wrapper: HTMLSpanElement | null) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      selectedImageRef.current = wrapper;
      selectedAccordionRef.current = null;
      setEditorImageSelected(editorElement, wrapper);
      setEditorAccordionSelected(editorElement, null);
      wrapper?.focus({ preventScroll: true });
    },
    [editorRef]
  );

  const selectAccordion = useCallback(
    (wrapper: HTMLDivElement | null) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      selectedAccordionRef.current = wrapper;
      selectedImageRef.current = null;
      setEditorAccordionSelected(editorElement, wrapper);
      setEditorImageSelected(editorElement, null);
      wrapper?.focus({ preventScroll: true });
    },
    [editorRef]
  );

  useEffect(() => {
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const resizeState = resizeStateRef.current;
      const editorElement = editorRef.current;
      if (!resizeState || !editorElement) return;

      const editorWidth = editorElement.getBoundingClientRect().width;
      const maxWidth = Math.max(80, editorWidth - 40);
      const nextWidth = Math.min(
        maxWidth,
        Math.max(80, resizeState.startWidth + event.clientX - resizeState.startX)
      );
      resizeState.wrapper.style.width = `${Math.round(nextWidth)}px`;
    };

    const handlePointerUp = () => {
      const resizeState = resizeStateRef.current;
      const editorElement = editorRef.current;
      if (!resizeState || !editorElement) return;

      const resizedImageSource =
        resizeState.wrapper.querySelector<HTMLImageElement>("img")?.getAttribute("src") ?? "";
      const resizedImageWidth = resizeState.wrapper.style.width;

      const restoreResizedImageSelection = () => {
        const currentEditorElement = editorRef.current;
        if (!currentEditorElement) return;

        const currentWrapper = resizeState.wrapper.isConnected
          ? resizeState.wrapper
          : (Array.from(
              currentEditorElement.querySelectorAll<HTMLSpanElement>(editorImageWrapperSelector)
            ).find((wrapper) => {
              const imageSource = wrapper
                .querySelector<HTMLImageElement>("img")
                ?.getAttribute("src");
              return (
                imageSource === resizedImageSource && wrapper.style.width === resizedImageWidth
              );
            }) ?? null);

        selectedImageRef.current = currentWrapper;
        setEditorImageSelected(currentEditorElement, currentWrapper);
        currentWrapper?.focus({ preventScroll: true });
      };

      resizeStateRef.current = null;
      selectedImageRef.current = resizeState.wrapper;
      setEditorImageSelected(editorElement, resizeState.wrapper);
      resizeState.wrapper.focus({ preventScroll: true });
      window.setTimeout(() => {
        syncEditorHtml();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(restoreResizedImageSelection);
        });
      }, 0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [editorRef, syncEditorHtml]);

  useEffect(() => {
    const handleDocumentPointerDown = (event: globalThis.PointerEvent) => {
      const selectedImage = selectedImageRef.current;
      const selectedAccordion = selectedAccordionRef.current;
      const editorElement = editorRef.current;
      if ((!selectedImage && !selectedAccordion) || !editorElement) return;
      if (!(event.target instanceof Node)) return;
      if (editorElement.contains(event.target)) return;

      selectedImageRef.current = null;
      selectedAccordionRef.current = null;
      setEditorImageSelected(editorElement, null);
      setEditorAccordionSelected(editorElement, null);
    };

    const handleWindowKeyDown = (event: globalThis.KeyboardEvent) => {
      const selectedImage = selectedImageRef.current;
      const selectedAccordion = selectedAccordionRef.current;
      const selectedElement = selectedImage ?? selectedAccordion;
      const editorElement = editorRef.current;
      if (
        !selectedElement ||
        !editorElement ||
        !selectedElement.isConnected ||
        (event.key !== "Delete" && event.key !== "Backspace")
      )
        return;

      if (!editorElement.contains(selectedElement)) return;

      event.preventDefault();
      selectedElement.remove();
      selectedImageRef.current = null;
      selectedAccordionRef.current = null;
      updateEditorAccordionReorderButtons(editorElement);
      editorElement.focus({ preventScroll: true });
      syncEditorHtml();
    };

    window.addEventListener("pointerdown", handleDocumentPointerDown);
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handleDocumentPointerDown);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [editorRef, syncEditorHtml]);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    updateEditorAccordionReorderButtons(editorElement);
  }, [editorRef]);

  const handleEditorClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const accordionReorderButton =
        event.target instanceof Element
          ? event.target.closest(editorAccordionReorderHandleSelector)
          : null;
      if (accordionReorderButton) {
        event.preventDefault();
        if (
          accordionReorderButton instanceof HTMLButtonElement &&
          accordionReorderButton.disabled
        ) {
          return;
        }

        const accordionWrapper = findEditorAccordionWrapper(accordionReorderButton);
        if (!accordionWrapper || !editorElement.contains(accordionWrapper)) return;

        if (reorderEditorAccordion(editorElement, accordionWrapper)) {
          selectedAccordionRef.current = accordionWrapper;
          setEditorAccordionSelected(editorElement, accordionWrapper);
          accordionWrapper.focus({ preventScroll: true });
          syncEditorHtml();
        }
        return;
      }

      const accordionDeleteButton =
        event.target instanceof Element
          ? event.target.closest(editorAccordionDeleteButtonSelector)
          : null;
      if (accordionDeleteButton) {
        const accordionWrapper = findEditorAccordionWrapper(accordionDeleteButton);
        if (!accordionWrapper || !editorElement.contains(accordionWrapper)) return;

        event.preventDefault();
        accordionWrapper.remove();
        selectedAccordionRef.current = null;
        updateEditorAccordionReorderButtons(editorElement);
        editorElement.focus({ preventScroll: true });
        syncEditorHtml();
        return;
      }

      if (ignoreNextClickRef.current) {
        ignoreNextClickRef.current = false;
        event.preventDefault();
        setEditorImageSelected(editorElement, selectedImageRef.current);
        setEditorAccordionSelected(editorElement, selectedAccordionRef.current);
        selectedImageRef.current?.focus({ preventScroll: true });
        selectedAccordionRef.current?.focus({ preventScroll: true });
        return;
      }

      const imageWrapper = findEditorImageWrapper(event.target);
      if (imageWrapper && editorElement.contains(imageWrapper)) {
        event.preventDefault();
        selectImage(imageWrapper);
        return;
      }

      const accordionWrapper = findEditorAccordionWrapper(event.target);
      if (accordionWrapper && editorElement.contains(accordionWrapper)) {
        if (isEditorAccordionEditableArea(event.target)) {
          selectAccordion(null);
          return;
        }

        event.preventDefault();
        selectAccordion(accordionWrapper);
        return;
      }

      selectImage(null);
      selectAccordion(null);
    },
    [editorRef, selectAccordion, selectImage, syncEditorHtml]
  );

  const handleEditorKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const selectedImage = selectedImageRef.current;
      const selectedAccordion = selectedAccordionRef.current;
      const selectedElement = selectedImage ?? selectedAccordion;
      if (!selectedElement || (event.key !== "Delete" && event.key !== "Backspace")) return;

      event.preventDefault();
      selectedElement.remove();
      selectedImageRef.current = null;
      selectedAccordionRef.current = null;
      updateEditorAccordionReorderButtons(event.currentTarget);
      event.currentTarget.focus({ preventScroll: true });
      syncEditorHtml();
    },
    [syncEditorHtml]
  );

  const handleEditorPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const editorElement = editorRef.current;
      if (!editorElement || event.button !== 0) return;
      if (!(event.target instanceof Element)) return;

      const accordionReorderButton = event.target.closest(editorAccordionReorderHandleSelector);
      if (accordionReorderButton) {
        event.preventDefault();
        event.stopPropagation();
        const accordionWrapper = findEditorAccordionWrapper(accordionReorderButton);
        if (!accordionWrapper || !editorElement.contains(accordionWrapper)) return;
        selectAccordion(accordionWrapper);
        return;
      }

      const accordionDeleteButton = event.target.closest(editorAccordionDeleteButtonSelector);
      if (accordionDeleteButton) {
        const accordionWrapper = findEditorAccordionWrapper(accordionDeleteButton);
        if (!accordionWrapper || !editorElement.contains(accordionWrapper)) return;

        event.preventDefault();
        event.stopPropagation();
        accordionWrapper.remove();
        selectedAccordionRef.current = null;
        updateEditorAccordionReorderButtons(editorElement);
        editorElement.focus({ preventScroll: true });
        syncEditorHtml();
        return;
      }

      const accordionWrapper = findEditorAccordionWrapper(event.target);
      if (accordionWrapper && editorElement.contains(accordionWrapper)) {
        if (isEditorAccordionEditableArea(event.target)) {
          selectAccordion(null);
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        selectAccordion(accordionWrapper);
        ignoreNextClickRef.current = true;
        return;
      }

      if (!event.target.closest(editorImageResizeHandleSelector)) return;

      const wrapper = findEditorImageWrapper(event.target);
      if (!wrapper || !editorElement.contains(wrapper)) return;

      event.preventDefault();
      event.stopPropagation();
      selectImage(wrapper);
      ignoreNextClickRef.current = true;
      resizeStateRef.current = {
        wrapper,
        startX: event.clientX,
        startWidth: wrapper.getBoundingClientRect().width,
      };
    },
    [editorRef, selectAccordion, selectImage, syncEditorHtml]
  );

  return { handleEditorClick, handleEditorKeyDown, handleEditorPointerDown };
}

const productDescriptionMaxLength = 600;
const productDescriptionPlaceholder = "Descritivo, roteiro, o que está incluso, etc...";

function getEditorPlainTextLength(source: string) {
  if (!source) return 0;

  const template = document.createElement("template");
  template.innerHTML = source;

  return (template.content.textContent ?? "").length;
}

function enforceEditorPlainTextLimit(
  editorElement: HTMLDivElement,
  maxLength: number,
  shouldMoveCaret = true
) {
  const textContent = editorElement.textContent ?? "";
  if (textContent.length <= maxLength) return;

  editorElement.textContent = textContent.slice(0, maxLength);
  if (!shouldMoveCaret) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(editorElement);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function limitEditorHtmlPlainText(source: string, maxLength: number) {
  const editorElement = document.createElement("div");
  editorElement.innerHTML = source;
  enforceEditorPlainTextLimit(editorElement, maxLength, false);

  return getSerializableEditorHtml(editorElement);
}

function ProductDescriptionEditor({
  value,
  onChange,
}: {
  readonly value: string;
  readonly onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [isFontSizeListOpen, setIsFontSizeListOpen] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState(editorDefaultTextColor);
  const [selectedTextBackgroundColor, setSelectedTextBackgroundColor] = useState(
    editorDefaultTextBackgroundColor
  );
  const [customTextColor, setCustomTextColor] = useState(editorDefaultCustomTextColor);
  const [customTextBackgroundColor, setCustomTextBackgroundColor] = useState(
    editorDefaultCustomTextBackgroundColor
  );
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const hasSourceContent = hasSerializableEditorContent(value);
  const characterCount = getEditorPlainTextLength(value);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (
      !editorElement ||
      (document.activeElement instanceof Node && editorElement.contains(document.activeElement)) ||
      editorElement.innerHTML === value
    )
      return;

    editorElement.innerHTML = value;
  }, [value]);

  const syncEditorHtml = useCallback(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    enforceEditorPlainTextLimit(editorElement, productDescriptionMaxLength);
    onChange(getSerializableEditorHtml(editorElement));
  }, [onChange]);

  const { handleEditorClick, handleEditorKeyDown, handleEditorPointerDown } =
    useEditorEmbeddedElementControls(editorRef, syncEditorHtml);
  const { handleInsertLink, handleLinkPopoverOpenChange, isLinkPopoverOpen } = useEditorLinkControl(
    editorRef,
    syncEditorHtml
  );
  const { handleEmojiPopoverOpenChange, handleSelectEmoji, isEmojiPopoverOpen, recentEmojis } =
    useEditorEmojiControl(editorRef, syncEditorHtml);

  const runEditorCommand = useCallback(
    (command: string, commandValue?: string) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      if (command === "insertUnorderedList" || command === "insertOrderedList") {
        applyListToEditor(editorElement, command === "insertOrderedList" ? "ordered" : "unordered");
        syncEditorHtml();
        return;
      }

      editorElement.focus();
      document.execCommand(command, false, commandValue);
      syncEditorHtml();
    },
    [syncEditorHtml]
  );

  const handleEditorShortcutKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const shortcutAction = getEditorKeyboardShortcutAction(event);
      if (!shortcutAction) {
        handleEditorKeyDown(event);
        return;
      }

      event.preventDefault();
      if (shortcutAction.kind === "link") {
        handleLinkPopoverOpenChange(true);
        return;
      }

      runEditorCommand(shortcutAction.command);
    },
    [handleEditorKeyDown, handleLinkPopoverOpenChange, runEditorCommand]
  );

  const handleEditorBeforeInput = useCallback((event: FormEvent<HTMLDivElement>) => {
    const nativeEvent = event.nativeEvent;
    if (typeof InputEvent === "undefined" || !(nativeEvent instanceof InputEvent)) return;
    if (nativeEvent.inputType.startsWith("delete")) return;

    const selectedText = window.getSelection()?.toString() ?? "";
    const currentLength = event.currentTarget.textContent?.length ?? 0;
    const insertedText = nativeEvent.data ?? "";
    if (currentLength - selectedText.length + insertedText.length <= productDescriptionMaxLength) {
      return;
    }

    event.preventDefault();
  }, []);

  const handleEditorInput = useCallback(
    (event: FormEvent<HTMLDivElement>) => {
      enforceEditorPlainTextLimit(event.currentTarget, productDescriptionMaxLength);
      onChange(getSerializableEditorHtml(event.currentTarget));
    },
    [onChange]
  );

  const handleInsertImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleInsertAccordion = useCallback(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    insertAccordionIntoEditor(editorElement);
    syncEditorHtml();
  }, [syncEditorHtml]);

  const handleImageFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.item(0);
      event.currentTarget.value = "";
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") return;

        const editorElement = editorRef.current;
        if (!editorElement) return;

        insertImageIntoEditor(editorElement, reader.result);
        syncEditorHtml();
      });
      reader.readAsDataURL(file);
    },
    [syncEditorHtml]
  );

  const handleSelectFontSize = useCallback(
    (fontSize: (typeof editorFontSizes)[number]) => {
      setSelectedFontSize(fontSize.label);
      setIsFontSizeListOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        style.fontSize = fontSize.value;
      });

      if (didApplyStyle) {
        syncEditorHtml();
      }
    },
    [syncEditorHtml]
  );

  const handleSelectTextColor = useCallback(
    (color: string) => {
      setSelectedTextColor(color);
      setIsTextColorPickerOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        style.color = color;
      });

      if (didApplyStyle) {
        syncEditorHtml();
        return;
      }

      runEditorCommand("foreColor", color);
    },
    [runEditorCommand, syncEditorHtml]
  );

  const handleSelectTextBackgroundColor = useCallback(
    (color: string) => {
      setSelectedTextBackgroundColor(color);
      setIsTextColorPickerOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        if (color === editorDefaultTextBackgroundColor) {
          style.removeProperty("background-color");
          return;
        }

        style.backgroundColor = color;
      });

      if (didApplyStyle) {
        syncEditorHtml();
        return;
      }

      if (color !== editorDefaultTextBackgroundColor) {
        runEditorCommand("hiliteColor", color);
      }
    },
    [runEditorCommand, syncEditorHtml]
  );

  const handleRestoreDefaultEditorColors = useCallback(() => {
    setSelectedTextColor(editorDefaultTextColor);
    setSelectedTextBackgroundColor(editorDefaultTextBackgroundColor);
    setCustomTextColor(editorDefaultCustomTextColor);
    setCustomTextBackgroundColor(editorDefaultCustomTextBackgroundColor);
    setIsTextColorPickerOpen(false);

    const editorElement = editorRef.current;
    if (!editorElement) return;

    const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
      style.color = editorDefaultTextColor;
      style.removeProperty("background-color");
    });

    if (didApplyStyle) {
      removeBackgroundColorFromEditorContent(editorElement);
      syncEditorHtml();
      return;
    }

    const didRemoveBackgroundColor = removeBackgroundColorFromEditorContent(editorElement);

    runEditorCommand("foreColor", editorDefaultTextColor);
    if (didRemoveBackgroundColor) {
      syncEditorHtml();
    }
  }, [runEditorCommand, syncEditorHtml]);

  return (
    <div className="flex w-full max-w-[720px] flex-col gap-3">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        tabIndex={-1}
        onChange={handleImageFileChange}
      />
      <div className="flex w-max max-w-full flex-col items-start justify-center gap-2 md:flex-row md:items-center md:justify-start md:gap-3">
        <div
          className="relative flex gap-2"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsFontSizeListOpen(false);
          }}
        >
          <button
            type="button"
            className="border-input bg-card text-foreground hover:bg-muted/50 focus-visible:ring-primary/20 flex h-10 w-[88px] cursor-pointer items-center justify-between rounded-[8px] border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition duration-100 ease-linear outline-none focus-visible:ring-3"
            aria-label="Tamanho da fonte na descrição completa"
            aria-haspopup="listbox"
            aria-expanded={isFontSizeListOpen}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsFontSizeListOpen((currentValue) => !currentValue)}
          >
            <span>{selectedFontSize}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} aria-hidden="true" />
          </button>
          {isFontSizeListOpen ? (
            <div
              role="listbox"
              aria-label="Tamanho da fonte na descrição completa"
              className="border-input bg-card absolute top-[44px] left-0 z-20 flex w-[88px] flex-col overflow-hidden rounded-[8px] border py-1 shadow-[0px_8px_12px_rgba(0,0,0,0.12)]"
            >
              {editorFontSizes.map((fontSize) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={fontSize.label === selectedFontSize}
                  key={fontSize.label}
                  className={`flex h-8 items-center px-3 text-left font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors ${
                    fontSize.label === selectedFontSize
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelectFontSize(fontSize)}
                >
                  {fontSize.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-0.5 md:flex-nowrap">
          <TextEditorToolbarButton
            ariaLabel="Negrito na descrição completa"
            shortcutLabel={editorShortcutLabels.bold}
            onClick={() => runEditorCommand("bold")}
          >
            <BoldEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Itálico na descrição completa"
            shortcutLabel={editorShortcutLabels.italic}
            onClick={() => runEditorCommand("italic")}
          >
            <ItalicEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Sublinhado na descrição completa"
            shortcutLabel={editorShortcutLabels.underline}
            onClick={() => runEditorCommand("underline")}
          >
            <UnderlineEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Riscar na descrição completa"
            shortcutLabel={editorShortcutLabels.strikethrough}
            onClick={() => runEditorCommand("strikeThrough")}
          >
            <StrikethroughEditorIcon />
          </TextEditorToolbarButton>
          <EditorEmojiToolbarControl
            ariaLabel="Biblioteca de emojis na descrição completa"
            isOpen={isEmojiPopoverOpen}
            recentEmojis={recentEmojis}
            onOpenChange={handleEmojiPopoverOpenChange}
            onSelectEmoji={handleSelectEmoji}
          />
          <ToolbarDivider />
          <TextColorToolbarControl
            ariaLabel="Cor do texto na descrição completa"
            selectedTextColor={selectedTextColor}
            selectedTextBackgroundColor={selectedTextBackgroundColor}
            customTextColor={customTextColor}
            customTextBackgroundColor={customTextBackgroundColor}
            isOpen={isTextColorPickerOpen}
            onOpenChange={setIsTextColorPickerOpen}
            onCustomTextColorChange={setCustomTextColor}
            onCustomTextBackgroundColorChange={setCustomTextBackgroundColor}
            onSelectTextColor={handleSelectTextColor}
            onSelectTextBackgroundColor={handleSelectTextBackgroundColor}
            onRestoreDefaultColors={handleRestoreDefaultEditorColors}
          />
          <ToolbarDivider />
          <TextEditorToolbarButton
            ariaLabel="Alinhar à esquerda na descrição completa"
            shortcutLabel={editorShortcutLabels.alignLeft}
            onClick={() => runEditorCommand("justifyLeft")}
          >
            <AlignLeftEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Alinhar ao centro na descrição completa"
            shortcutLabel={editorShortcutLabels.alignCenter}
            onClick={() => runEditorCommand("justifyCenter")}
          >
            <AlignCenterEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Lista com marcadores na descrição completa"
            shortcutLabel={editorShortcutLabels.bulletList}
            onClick={() => runEditorCommand("insertUnorderedList")}
          >
            <BulletListEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Lista enumerada na descrição completa"
            shortcutLabel={editorShortcutLabels.orderedList}
            onClick={() => runEditorCommand("insertOrderedList")}
          >
            <OrderedListEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Adicionar acordeão na descrição completa"
            onClick={handleInsertAccordion}
          >
            <AccordionEditorIcon />
          </TextEditorToolbarButton>
          <ToolbarDivider />
          <EditorLinkToolbarControl
            ariaLabel="Adicionar link na descrição completa"
            shortcutLabel={editorShortcutLabels.link}
            isOpen={isLinkPopoverOpen}
            onOpenChange={handleLinkPopoverOpenChange}
            onInsertLink={handleInsertLink}
          />
          <TextEditorToolbarButton
            ariaLabel="Adicionar imagem na descrição completa"
            onClick={handleInsertImage}
          >
            <ImageEditorIcon />
          </TextEditorToolbarButton>
          <ToolbarDivider />
          <TextEditorToolbarButton
            ariaLabel="Ver código fonte da descrição completa"
            disabled={!hasSourceContent}
            onClick={() => setIsSourceDialogOpen(true)}
          >
            <SourceCodeEditorIcon />
          </TextEditorToolbarButton>
          <TextEditorToolbarButton
            ariaLabel="Assistente de escrita na descrição completa"
            onClick={() => runEditorCommand("insertText", "")}
          >
            <AssistantEditorIcon />
          </TextEditorToolbarButton>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-label="Descrição completa"
          aria-multiline="true"
          suppressContentEditableWarning
          tabIndex={0}
          data-placeholder={productDescriptionPlaceholder}
          className="rich-text-editor border-input bg-card text-foreground empty:before:text-muted-foreground focus:border-primary focus:ring-primary/20 min-h-[148px] w-full resize-y overflow-auto rounded-[12px] border border-[#e4e4e7] px-4 py-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[1.5] whitespace-pre-wrap shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition-colors outline-none empty:before:pointer-events-none empty:before:block empty:before:content-[attr(data-placeholder)] focus:ring-3 [&_li]:pl-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
          onBeforeInput={handleEditorBeforeInput}
          onClick={handleEditorClick}
          onInput={handleEditorInput}
          onKeyDown={handleEditorShortcutKeyDown}
          onPointerDown={handleEditorPointerDown}
        />
        <p className="text-right font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
          {Math.min(characterCount, productDescriptionMaxLength)}/{productDescriptionMaxLength}{" "}
          caracteres
        </p>
      </div>
      <EditorSourceDialog
        open={isSourceDialogOpen}
        title="Código fonte da descrição completa"
        description="Edite o HTML do campo para ajustar diretamente o conteúdo exibido no editor."
        source={value}
        onOpenChange={setIsSourceDialogOpen}
        onSourceChange={(source) =>
          onChange(limitEditorHtmlPlainText(source, productDescriptionMaxLength))
        }
      />
    </div>
  );
}

function ResponsibilityTermsSection({
  title,
  text,
  onTitleChange,
  onTextChange,
}: {
  readonly title: string;
  readonly text: string;
  readonly onTitleChange: (value: string) => void;
  readonly onTextChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [isFontSizeListOpen, setIsFontSizeListOpen] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState(editorDefaultTextColor);
  const [selectedTextBackgroundColor, setSelectedTextBackgroundColor] = useState(
    editorDefaultTextBackgroundColor
  );
  const [customTextColor, setCustomTextColor] = useState(editorDefaultCustomTextColor);
  const [customTextBackgroundColor, setCustomTextBackgroundColor] = useState(
    editorDefaultCustomTextBackgroundColor
  );
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const hasSourceContent = hasSerializableEditorContent(text);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (
      !editorElement ||
      (document.activeElement instanceof Node && editorElement.contains(document.activeElement)) ||
      editorElement.innerHTML === text
    )
      return;

    editorElement.innerHTML = text;
  }, [text]);

  const syncEditorHtml = useCallback(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    onTextChange(getSerializableEditorHtml(editorElement));
  }, [onTextChange]);

  const { handleEditorClick, handleEditorKeyDown, handleEditorPointerDown } =
    useEditorEmbeddedElementControls(editorRef, syncEditorHtml);
  const { handleInsertLink, handleLinkPopoverOpenChange, isLinkPopoverOpen } = useEditorLinkControl(
    editorRef,
    syncEditorHtml
  );
  const { handleEmojiPopoverOpenChange, handleSelectEmoji, isEmojiPopoverOpen, recentEmojis } =
    useEditorEmojiControl(editorRef, syncEditorHtml);

  const runEditorCommand = useCallback(
    (command: string, value?: string) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      if (command === "insertUnorderedList" || command === "insertOrderedList") {
        applyListToEditor(editorElement, command === "insertOrderedList" ? "ordered" : "unordered");
        syncEditorHtml();
        return;
      }

      editorElement.focus();
      document.execCommand(command, false, value);
      syncEditorHtml();
    },
    [syncEditorHtml]
  );

  const handleEditorShortcutKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const shortcutAction = getEditorKeyboardShortcutAction(event);
      if (!shortcutAction) {
        handleEditorKeyDown(event);
        return;
      }

      event.preventDefault();
      if (shortcutAction.kind === "link") {
        handleLinkPopoverOpenChange(true);
        return;
      }

      runEditorCommand(shortcutAction.command);
    },
    [handleEditorKeyDown, handleLinkPopoverOpenChange, runEditorCommand]
  );

  const handleInsertImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleInsertAccordion = useCallback(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    insertAccordionIntoEditor(editorElement);
    syncEditorHtml();
  }, [syncEditorHtml]);

  const handleImageFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.item(0);
      event.currentTarget.value = "";
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") return;

        const editorElement = editorRef.current;
        if (!editorElement) return;

        insertImageIntoEditor(editorElement, reader.result);
        syncEditorHtml();
      });
      reader.readAsDataURL(file);
    },
    [syncEditorHtml]
  );

  const handleSelectFontSize = useCallback(
    (fontSize: (typeof editorFontSizes)[number]) => {
      setSelectedFontSize(fontSize.label);
      setIsFontSizeListOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        style.fontSize = fontSize.value;
      });

      if (didApplyStyle) {
        syncEditorHtml();
      }
    },
    [syncEditorHtml]
  );

  const handleSelectTextColor = useCallback(
    (color: string) => {
      setSelectedTextColor(color);
      setIsTextColorPickerOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        style.color = color;
      });

      if (didApplyStyle) {
        syncEditorHtml();
        return;
      }

      runEditorCommand("foreColor", color);
    },
    [runEditorCommand, syncEditorHtml]
  );

  const handleSelectTextBackgroundColor = useCallback(
    (color: string) => {
      setSelectedTextBackgroundColor(color);
      setIsTextColorPickerOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        if (color === editorDefaultTextBackgroundColor) {
          style.removeProperty("background-color");
          return;
        }

        style.backgroundColor = color;
      });

      if (didApplyStyle) {
        syncEditorHtml();
        return;
      }

      if (color !== editorDefaultTextBackgroundColor) {
        runEditorCommand("hiliteColor", color);
      }
    },
    [runEditorCommand, syncEditorHtml]
  );

  const handleRestoreDefaultEditorColors = useCallback(() => {
    setSelectedTextColor(editorDefaultTextColor);
    setSelectedTextBackgroundColor(editorDefaultTextBackgroundColor);
    setCustomTextColor(editorDefaultCustomTextColor);
    setCustomTextBackgroundColor(editorDefaultCustomTextBackgroundColor);
    setIsTextColorPickerOpen(false);

    const editorElement = editorRef.current;
    if (!editorElement) return;

    const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
      style.color = editorDefaultTextColor;
      style.removeProperty("background-color");
    });

    if (didApplyStyle) {
      removeBackgroundColorFromEditorContent(editorElement);
      syncEditorHtml();
      return;
    }

    const didRemoveBackgroundColor = removeBackgroundColorFromEditorContent(editorElement);

    runEditorCommand("foreColor", editorDefaultTextColor);
    if (didRemoveBackgroundColor) {
      syncEditorHtml();
      return;
    }
  }, [runEditorCommand, syncEditorHtml]);

  return (
    <div className="flex flex-col gap-5">
      <Field label="Título do termo">
        <input
          className={`${inputClass} text-[#414651] placeholder:text-[#717680]`}
          placeholder="Ex.: Termo de conhecimento de risco e corresponsabilidade"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </Field>

      <div className="flex w-full max-w-[720px] flex-col gap-3">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          tabIndex={-1}
          onChange={handleImageFileChange}
        />
        <div className="flex w-max max-w-full flex-col items-start justify-center gap-2 md:flex-row md:items-center md:justify-start md:gap-3">
          <div
            className="relative flex gap-2"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsFontSizeListOpen(false);
            }}
          >
            <button
              type="button"
              className="border-input bg-card text-foreground hover:bg-muted/50 focus-visible:ring-primary/20 flex h-10 w-[88px] cursor-pointer items-center justify-between rounded-[8px] border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition duration-100 ease-linear outline-none focus-visible:ring-3"
              aria-label="Tamanho da fonte"
              aria-haspopup="listbox"
              aria-expanded={isFontSizeListOpen}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setIsFontSizeListOpen((currentValue) => !currentValue)}
            >
              <span>{selectedFontSize}</span>
              <HugeiconsIcon icon={ArrowDown01Icon} size={16} aria-hidden="true" />
            </button>
            {isFontSizeListOpen ? (
              <div
                role="listbox"
                aria-label="Tamanho da fonte"
                className="border-input bg-card absolute top-[44px] left-0 z-20 flex w-[88px] flex-col overflow-hidden rounded-[8px] border py-1 shadow-[0px_8px_12px_rgba(0,0,0,0.12)]"
              >
                {editorFontSizes.map((fontSize) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={fontSize.label === selectedFontSize}
                    key={fontSize.label}
                    className={`flex h-8 items-center px-3 text-left font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors ${
                      fontSize.label === selectedFontSize
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectFontSize(fontSize)}
                  >
                    {fontSize.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-0.5 md:flex-nowrap">
            <TextEditorToolbarButton
              ariaLabel="Negrito"
              shortcutLabel={editorShortcutLabels.bold}
              onClick={() => runEditorCommand("bold")}
            >
              <BoldEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton
              ariaLabel="Itálico"
              shortcutLabel={editorShortcutLabels.italic}
              onClick={() => runEditorCommand("italic")}
            >
              <ItalicEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton
              ariaLabel="Sublinhado"
              shortcutLabel={editorShortcutLabels.underline}
              onClick={() => runEditorCommand("underline")}
            >
              <UnderlineEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton
              ariaLabel="Riscar"
              shortcutLabel={editorShortcutLabels.strikethrough}
              onClick={() => runEditorCommand("strikeThrough")}
            >
              <StrikethroughEditorIcon />
            </TextEditorToolbarButton>
            <EditorEmojiToolbarControl
              ariaLabel="Biblioteca de emojis"
              isOpen={isEmojiPopoverOpen}
              recentEmojis={recentEmojis}
              onOpenChange={handleEmojiPopoverOpenChange}
              onSelectEmoji={handleSelectEmoji}
            />
            <ToolbarDivider />
            <TextColorToolbarControl
              ariaLabel="Cor do texto"
              selectedTextColor={selectedTextColor}
              selectedTextBackgroundColor={selectedTextBackgroundColor}
              customTextColor={customTextColor}
              customTextBackgroundColor={customTextBackgroundColor}
              isOpen={isTextColorPickerOpen}
              onOpenChange={setIsTextColorPickerOpen}
              onCustomTextColorChange={setCustomTextColor}
              onCustomTextBackgroundColorChange={setCustomTextBackgroundColor}
              onSelectTextColor={handleSelectTextColor}
              onSelectTextBackgroundColor={handleSelectTextBackgroundColor}
              onRestoreDefaultColors={handleRestoreDefaultEditorColors}
            />
            <ToolbarDivider />
            <TextEditorToolbarButton
              ariaLabel="Alinhar à esquerda"
              shortcutLabel={editorShortcutLabels.alignLeft}
              onClick={() => runEditorCommand("justifyLeft")}
            >
              <AlignLeftEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton
              ariaLabel="Alinhar ao centro"
              shortcutLabel={editorShortcutLabels.alignCenter}
              onClick={() => runEditorCommand("justifyCenter")}
            >
              <AlignCenterEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton
              ariaLabel="Lista com marcadores"
              shortcutLabel={editorShortcutLabels.bulletList}
              onClick={() => runEditorCommand("insertUnorderedList")}
            >
              <BulletListEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton
              ariaLabel="Lista enumerada"
              shortcutLabel={editorShortcutLabels.orderedList}
              onClick={() => runEditorCommand("insertOrderedList")}
            >
              <OrderedListEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton ariaLabel="Adicionar acordeão" onClick={handleInsertAccordion}>
              <AccordionEditorIcon />
            </TextEditorToolbarButton>
            <ToolbarDivider />
            <EditorLinkToolbarControl
              ariaLabel="Adicionar link"
              shortcutLabel={editorShortcutLabels.link}
              isOpen={isLinkPopoverOpen}
              onOpenChange={handleLinkPopoverOpenChange}
              onInsertLink={handleInsertLink}
            />
            <TextEditorToolbarButton ariaLabel="Adicionar imagem" onClick={handleInsertImage}>
              <ImageEditorIcon />
            </TextEditorToolbarButton>
            <ToolbarDivider />
            <TextEditorToolbarButton
              ariaLabel="Ver código fonte"
              disabled={!hasSourceContent}
              onClick={() => setIsSourceDialogOpen(true)}
            >
              <SourceCodeEditorIcon />
            </TextEditorToolbarButton>
            <TextEditorToolbarButton
              ariaLabel="Assistente de escrita"
              onClick={() => runEditorCommand("insertText", "")}
            >
              <AssistantEditorIcon />
            </TextEditorToolbarButton>
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-label="Texto do termo"
          aria-multiline="true"
          suppressContentEditableWarning
          tabIndex={0}
          data-placeholder={responsibilityTermTextPlaceholder}
          className="rich-text-editor border-input bg-card text-foreground empty:before:text-muted-foreground focus:border-primary focus:ring-primary/20 min-h-[432px] w-full resize-y overflow-auto rounded-[8px] border p-5 font-['Helvetica_Neue:Regular',sans-serif] text-base leading-[1.5] whitespace-pre-wrap shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition-colors outline-none empty:before:pointer-events-none empty:before:block empty:before:content-[attr(data-placeholder)] focus:ring-3 [&_li]:pl-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
          onClick={handleEditorClick}
          onInput={(event) => onTextChange(getSerializableEditorHtml(event.currentTarget))}
          onKeyDown={handleEditorShortcutKeyDown}
          onPointerDown={handleEditorPointerDown}
        />
        <EditorSourceDialog
          open={isSourceDialogOpen}
          title="Código fonte"
          description="Edite o HTML do campo para ajustar diretamente o conteúdo exibido no editor."
          source={text}
          onOpenChange={setIsSourceDialogOpen}
          onSourceChange={onTextChange}
        />
      </div>
    </div>
  );
}

function CommunicationTemplateEditor({
  title,
  description,
  channelLabel,
  checked,
  onCheckedChange,
  templateLabel,
  templateValue,
  templateOptions,
  onTemplateValueChange,
  text,
  onTextChange,
  fullToolbar,
}: {
  readonly title: string;
  readonly description: string;
  readonly channelLabel: string;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly templateLabel: string;
  readonly templateValue: string;
  readonly templateOptions: readonly { readonly value: string; readonly label: string }[];
  readonly onTemplateValueChange: (value: string) => void;
  readonly text: string;
  readonly onTextChange: (value: string) => void;
  readonly fullToolbar?: boolean;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [isFontSizeListOpen, setIsFontSizeListOpen] = useState(false);
  const [selectedTextColor, setSelectedTextColor] = useState(editorDefaultTextColor);
  const [selectedTextBackgroundColor, setSelectedTextBackgroundColor] = useState(
    editorDefaultTextBackgroundColor
  );
  const [customTextColor, setCustomTextColor] = useState(editorDefaultCustomTextColor);
  const [customTextBackgroundColor, setCustomTextBackgroundColor] = useState(
    editorDefaultCustomTextBackgroundColor
  );
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const hasSourceContent = hasSerializableEditorContent(text);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (
      !editorElement ||
      (document.activeElement instanceof Node && editorElement.contains(document.activeElement)) ||
      editorElement.innerHTML === text
    )
      return;

    editorElement.innerHTML = text;
  }, [text]);

  const syncEditorHtml = useCallback(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    onTextChange(getSerializableEditorHtml(editorElement));
  }, [onTextChange]);

  const { handleEditorClick, handleEditorKeyDown, handleEditorPointerDown } =
    useEditorEmbeddedElementControls(editorRef, syncEditorHtml);
  const { handleInsertLink, handleLinkPopoverOpenChange, isLinkPopoverOpen } = useEditorLinkControl(
    editorRef,
    syncEditorHtml
  );
  const { handleEmojiPopoverOpenChange, handleSelectEmoji, isEmojiPopoverOpen, recentEmojis } =
    useEditorEmojiControl(editorRef, syncEditorHtml);

  const runEditorCommand = useCallback(
    (command: string, value?: string) => {
      const editorElement = editorRef.current;
      if (!editorElement) return;

      if (command === "insertUnorderedList" || command === "insertOrderedList") {
        applyListToEditor(editorElement, command === "insertOrderedList" ? "ordered" : "unordered");
        syncEditorHtml();
        return;
      }

      editorElement.focus();
      document.execCommand(command, false, value);
      syncEditorHtml();
    },
    [syncEditorHtml]
  );

  const handleEditorShortcutKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const shortcutAction = getEditorKeyboardShortcutAction(event);
      if (!shortcutAction) {
        handleEditorKeyDown(event);
        return;
      }

      event.preventDefault();
      if (shortcutAction.kind === "link") {
        handleLinkPopoverOpenChange(true);
        return;
      }

      runEditorCommand(shortcutAction.command);
    },
    [handleEditorKeyDown, handleLinkPopoverOpenChange, runEditorCommand]
  );

  const handleInsertImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const handleInsertAccordion = useCallback(() => {
    const editorElement = editorRef.current;
    if (!editorElement) return;

    insertAccordionIntoEditor(editorElement);
    syncEditorHtml();
  }, [syncEditorHtml]);

  const handleImageFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.item(0);
      event.currentTarget.value = "";
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result !== "string") return;

        const editorElement = editorRef.current;
        if (!editorElement) return;

        insertImageIntoEditor(editorElement, reader.result);
        syncEditorHtml();
      });
      reader.readAsDataURL(file);
    },
    [syncEditorHtml]
  );

  const handleSelectFontSize = useCallback(
    (fontSize: (typeof editorFontSizes)[number]) => {
      setSelectedFontSize(fontSize.label);
      setIsFontSizeListOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        style.fontSize = fontSize.value;
      });

      if (didApplyStyle) {
        syncEditorHtml();
      }
    },
    [syncEditorHtml]
  );

  const handleSelectTextColor = useCallback(
    (color: string) => {
      setSelectedTextColor(color);
      setIsTextColorPickerOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        style.color = color;
      });

      if (didApplyStyle) {
        syncEditorHtml();
        return;
      }

      runEditorCommand("foreColor", color);
    },
    [runEditorCommand, syncEditorHtml]
  );

  const handleSelectTextBackgroundColor = useCallback(
    (color: string) => {
      setSelectedTextBackgroundColor(color);
      setIsTextColorPickerOpen(false);
      const editorElement = editorRef.current;
      if (!editorElement) return;

      const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
        if (color === editorDefaultTextBackgroundColor) {
          style.removeProperty("background-color");
          return;
        }

        style.backgroundColor = color;
      });

      if (didApplyStyle) {
        syncEditorHtml();
        return;
      }

      if (color !== editorDefaultTextBackgroundColor) {
        runEditorCommand("hiliteColor", color);
      }
    },
    [runEditorCommand, syncEditorHtml]
  );

  const handleRestoreDefaultEditorColors = useCallback(() => {
    setSelectedTextColor(editorDefaultTextColor);
    setSelectedTextBackgroundColor(editorDefaultTextBackgroundColor);
    setCustomTextColor(editorDefaultCustomTextColor);
    setCustomTextBackgroundColor(editorDefaultCustomTextBackgroundColor);
    setIsTextColorPickerOpen(false);

    const editorElement = editorRef.current;
    if (!editorElement) return;

    const didApplyStyle = applyInlineStyleToEditorSelection(editorElement, (style) => {
      style.color = editorDefaultTextColor;
      style.removeProperty("background-color");
    });

    if (didApplyStyle) {
      removeBackgroundColorFromEditorContent(editorElement);
      syncEditorHtml();
      return;
    }

    const didRemoveBackgroundColor = removeBackgroundColorFromEditorContent(editorElement);

    runEditorCommand("foreColor", editorDefaultTextColor);
    if (didRemoveBackgroundColor) {
      syncEditorHtml();
      return;
    }
  }, [runEditorCommand, syncEditorHtml]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#181d27]">
            {title}
          </p>
          <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#717680]">
            {description}
          </p>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={channelLabel} />
      </div>

      {checked ? (
        <div className="flex flex-col gap-5">
          <Field label={templateLabel}>
            <Select value={templateValue} onValueChange={onTemplateValueChange}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                className={selectContentClass}
              >
                {templateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
              {communicationTemplateHint}
              <button
                type="button"
                className="text-[#0b5ed7] transition-colors hover:text-[#084fb7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
              >
                Central de Comunicação
              </button>
              . Aqui você decide qual usar para o produto.
            </p>
          </Field>

          <div className="flex w-full flex-col gap-3">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              tabIndex={-1}
              onChange={handleImageFileChange}
            />
            <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
              {fullToolbar ? (
                <div
                  className="relative flex gap-2"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget))
                      setIsFontSizeListOpen(false);
                  }}
                >
                  <button
                    type="button"
                    className="border-input bg-card text-foreground hover:bg-muted/50 focus-visible:ring-primary/20 flex h-10 w-[88px] cursor-pointer items-center justify-between rounded-[8px] border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition duration-100 ease-linear outline-none focus-visible:ring-3"
                    aria-label="Tamanho da fonte"
                    aria-haspopup="listbox"
                    aria-expanded={isFontSizeListOpen}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setIsFontSizeListOpen((currentValue) => !currentValue)}
                  >
                    <span>{selectedFontSize}</span>
                    <HugeiconsIcon icon={ArrowDown01Icon} size={16} aria-hidden="true" />
                  </button>
                  {isFontSizeListOpen ? (
                    <div
                      role="listbox"
                      aria-label="Tamanho da fonte"
                      className="border-input bg-card absolute top-[44px] left-0 z-20 flex w-[88px] flex-col overflow-hidden rounded-[8px] border py-1 shadow-[0px_8px_12px_rgba(0,0,0,0.12)]"
                    >
                      {editorFontSizes.map((fontSize) => (
                        <button
                          type="button"
                          role="option"
                          aria-selected={fontSize.label === selectedFontSize}
                          key={fontSize.label}
                          className={`flex h-8 items-center px-3 text-left font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors ${
                            fontSize.label === selectedFontSize
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSelectFontSize(fontSize)}
                        >
                          {fontSize.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-0.5">
                <TextEditorToolbarButton
                  ariaLabel={`Negrito em ${templateLabel}`}
                  shortcutLabel={editorShortcutLabels.bold}
                  onClick={() => runEditorCommand("bold")}
                >
                  <BoldEditorIcon />
                </TextEditorToolbarButton>
                <TextEditorToolbarButton
                  ariaLabel={`Itálico em ${templateLabel}`}
                  shortcutLabel={editorShortcutLabels.italic}
                  onClick={() => runEditorCommand("italic")}
                >
                  <ItalicEditorIcon />
                </TextEditorToolbarButton>
                <TextEditorToolbarButton
                  ariaLabel={`Sublinhado em ${templateLabel}`}
                  shortcutLabel={editorShortcutLabels.underline}
                  onClick={() => runEditorCommand("underline")}
                >
                  <UnderlineEditorIcon />
                </TextEditorToolbarButton>
                <TextEditorToolbarButton
                  ariaLabel={`Riscar em ${templateLabel}`}
                  shortcutLabel={editorShortcutLabels.strikethrough}
                  onClick={() => runEditorCommand("strikeThrough")}
                >
                  <StrikethroughEditorIcon />
                </TextEditorToolbarButton>
                <EditorEmojiToolbarControl
                  ariaLabel={`Biblioteca de emojis em ${templateLabel}`}
                  isOpen={isEmojiPopoverOpen}
                  recentEmojis={recentEmojis}
                  onOpenChange={handleEmojiPopoverOpenChange}
                  onSelectEmoji={handleSelectEmoji}
                />
                {fullToolbar ? (
                  <>
                    <ToolbarDivider />
                    <TextColorToolbarControl
                      ariaLabel={`Cor do texto em ${templateLabel}`}
                      selectedTextColor={selectedTextColor}
                      selectedTextBackgroundColor={selectedTextBackgroundColor}
                      customTextColor={customTextColor}
                      customTextBackgroundColor={customTextBackgroundColor}
                      isOpen={isTextColorPickerOpen}
                      onOpenChange={setIsTextColorPickerOpen}
                      onCustomTextColorChange={setCustomTextColor}
                      onCustomTextBackgroundColorChange={setCustomTextBackgroundColor}
                      onSelectTextColor={handleSelectTextColor}
                      onSelectTextBackgroundColor={handleSelectTextBackgroundColor}
                      onRestoreDefaultColors={handleRestoreDefaultEditorColors}
                    />
                    <ToolbarDivider />
                    <TextEditorToolbarButton
                      ariaLabel={`Alinhar à esquerda em ${templateLabel}`}
                      shortcutLabel={editorShortcutLabels.alignLeft}
                      onClick={() => runEditorCommand("justifyLeft")}
                    >
                      <AlignLeftEditorIcon />
                    </TextEditorToolbarButton>
                    <TextEditorToolbarButton
                      ariaLabel={`Alinhar ao centro em ${templateLabel}`}
                      shortcutLabel={editorShortcutLabels.alignCenter}
                      onClick={() => runEditorCommand("justifyCenter")}
                    >
                      <AlignCenterEditorIcon />
                    </TextEditorToolbarButton>
                    <TextEditorToolbarButton
                      ariaLabel={`Lista com marcadores em ${templateLabel}`}
                      shortcutLabel={editorShortcutLabels.bulletList}
                      onClick={() => runEditorCommand("insertUnorderedList")}
                    >
                      <BulletListEditorIcon />
                    </TextEditorToolbarButton>
                    <TextEditorToolbarButton
                      ariaLabel={`Lista enumerada em ${templateLabel}`}
                      shortcutLabel={editorShortcutLabels.orderedList}
                      onClick={() => runEditorCommand("insertOrderedList")}
                    >
                      <OrderedListEditorIcon />
                    </TextEditorToolbarButton>
                    <TextEditorToolbarButton
                      ariaLabel={`Adicionar acordeão em ${templateLabel}`}
                      onClick={handleInsertAccordion}
                    >
                      <AccordionEditorIcon />
                    </TextEditorToolbarButton>
                  </>
                ) : null}
                <ToolbarDivider />
                <EditorLinkToolbarControl
                  ariaLabel={`Adicionar link em ${templateLabel}`}
                  shortcutLabel={editorShortcutLabels.link}
                  isOpen={isLinkPopoverOpen}
                  onOpenChange={handleLinkPopoverOpenChange}
                  onInsertLink={handleInsertLink}
                />
                <TextEditorToolbarButton
                  ariaLabel={`Adicionar imagem em ${templateLabel}`}
                  onClick={handleInsertImage}
                >
                  <ImageEditorIcon />
                </TextEditorToolbarButton>
                <ToolbarDivider />
                <TextEditorToolbarButton
                  ariaLabel={`Ver código fonte em ${templateLabel}`}
                  disabled={!hasSourceContent}
                  onClick={() => setIsSourceDialogOpen(true)}
                >
                  <SourceCodeEditorIcon />
                </TextEditorToolbarButton>
                <TextEditorToolbarButton
                  ariaLabel={`Assistente de escrita em ${templateLabel}`}
                  onClick={() => runEditorCommand("insertText", "")}
                >
                  <AssistantEditorIcon />
                </TextEditorToolbarButton>
              </div>
            </div>

            <div
              ref={editorRef}
              contentEditable
              role="textbox"
              aria-label={`Conteúdo de ${templateLabel}`}
              aria-multiline="true"
              suppressContentEditableWarning
              tabIndex={0}
              className="rich-text-editor border-input bg-card focus:border-primary focus:ring-primary/20 min-h-[242px] w-full resize-y overflow-auto rounded-xl border p-5 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#717680] shadow-[0px_1px_2px_rgba(10,13,18,0.05)] transition-colors outline-none focus:ring-3 [&_.communication-template-token]:inline-flex [&_.communication-template-token]:rounded-full [&_.communication-template-token]:border [&_.communication-template-token]:border-[#dbeafe] [&_.communication-template-token]:bg-[#e8f0fe] [&_.communication-template-token]:px-1.5 [&_.communication-template-token]:py-0.5 [&_.communication-template-token]:font-['Helvetica_Neue:Regular',sans-serif] [&_.communication-template-token]:text-xs [&_.communication-template-token]:leading-[18px] [&_.communication-template-token]:text-[#0b5ed7] [&_li]:pl-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
              onClick={handleEditorClick}
              onInput={(event) => onTextChange(getSerializableEditorHtml(event.currentTarget))}
              onKeyDown={handleEditorShortcutKeyDown}
              onPointerDown={handleEditorPointerDown}
            />
            <EditorSourceDialog
              open={isSourceDialogOpen}
              title={`Código fonte de ${templateLabel}`}
              description="Edite o HTML do campo para ajustar diretamente o conteúdo exibido no editor."
              source={text}
              onOpenChange={setIsSourceDialogOpen}
              onSourceChange={onTextChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolbarActionTooltip({
  label,
  shortcutLabel,
  children,
}: {
  readonly label: string;
  readonly shortcutLabel?: string;
  readonly children: ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={6}
          className="flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs"
        >
          <span>{label}</span>
          {shortcutLabel ? (
            <kbd
              data-slot="kbd"
              className="rounded-[4px] bg-white/15 px-1.5 py-0.5 font-['Helvetica_Neue:Regular',sans-serif] text-[10px] leading-none text-white/90"
            >
              {shortcutLabel}
            </kbd>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ToolbarActionTooltipBubble({
  label,
  shortcutLabel,
}: {
  readonly label: string;
  readonly shortcutLabel?: string;
}) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 inline-flex -translate-x-1/2 items-center gap-2 rounded-[8px] bg-[#181d27] px-2.5 py-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs whitespace-nowrap text-white opacity-0 shadow-[0px_4px_10px_rgba(0,0,0,0.16)] transition-opacity group-focus-within/toolbar-tooltip:opacity-100 group-hover/toolbar-tooltip:opacity-100"
    >
      <span>{label}</span>
      {shortcutLabel ? (
        <kbd className="rounded-[4px] bg-white/15 px-1.5 py-0.5 font-['Helvetica_Neue:Regular',sans-serif] text-[10px] leading-none text-white/90">
          {shortcutLabel}
        </kbd>
      ) : null}
    </span>
  );
}

function EditorLinkToolbarControl({
  ariaLabel,
  shortcutLabel,
  isOpen,
  onOpenChange,
  onInsertLink,
}: {
  readonly ariaLabel: string;
  readonly shortcutLabel?: string;
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onInsertLink: (link: EditorLinkConfig) => void;
}) {
  const [displayText, setDisplayText] = useState("");
  const [url, setUrl] = useState("");
  const [openInNewWindow, setOpenInNewWindow] = useState(false);

  useEffect(() => {
    if (isOpen) return;

    setDisplayText("");
    setUrl("");
    setOpenInNewWindow(false);
  }, [isOpen]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedDisplayText = displayText.trim();
      const trimmedUrl = url.trim();
      if (!trimmedDisplayText || !trimmedUrl) return;

      onInsertLink({
        displayText: trimmedDisplayText,
        openInNewWindow,
        url: trimmedUrl,
      });
    },
    [displayText, onInsertLink, openInNewWindow, url]
  );

  const canInsertLink = displayText.trim().length > 0 && url.trim().length > 0;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <span className="group/toolbar-tooltip relative inline-flex">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:ring-primary/20 flex size-8 cursor-pointer items-center justify-center rounded-md p-0 transition duration-100 ease-linear outline-none focus-visible:ring-3"
            onMouseDown={(event) => event.preventDefault()}
          >
            <LinkEditorIcon />
          </button>
        </PopoverTrigger>
        <ToolbarActionTooltipBubble
          label={getEditorToolbarTooltipLabel(ariaLabel)}
          shortcutLabel={shortcutLabel}
        />
      </span>
      <PopoverContent
        align="start"
        side="bottom"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="z-50 w-[302px] gap-3 rounded-[10px] border border-[#e9eaeb] bg-white p-3 shadow-[0px_8px_12px_rgba(0,0,0,0.12)]"
      >
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#414651]">
              Texto a ser exibido
            </span>
            <input
              value={displayText}
              onChange={(event) => setDisplayText(event.target.value)}
              className="focus:border-primary focus:ring-primary/20 h-9 rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
              placeholder="Ex.: Ver detalhes"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#414651]">
              URL de destino
            </span>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="focus:border-primary focus:ring-primary/20 h-9 rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
              placeholder="https://exemplo.com"
              inputMode="url"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#414651]">
            <Checkbox
              checked={openInNewWindow}
              onCheckedChange={(checked) => setOpenInNewWindow(checked === true)}
              className="size-4 rounded-[4px] border-[#e2e8f0] bg-white"
            />
            Abrir em uma nova janela
          </label>
          <button
            type="submit"
            disabled={!canInsertLink}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/20 flex h-9 w-full items-center justify-center rounded-[8px] px-3 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors focus-visible:ring-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Inserir link
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function TextEditorToolbarButton({
  ariaLabel,
  shortcutLabel,
  disabled = false,
  onClick,
  children,
}: {
  readonly ariaLabel: string;
  readonly shortcutLabel?: string;
  readonly disabled?: boolean;
  readonly onClick: () => void;
  readonly children: ReactNode;
}) {
  const button = (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className="text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:ring-primary/20 disabled:hover:text-muted-foreground flex size-8 cursor-pointer items-center justify-center rounded-md p-0 transition duration-100 ease-linear outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <ToolbarActionTooltip
      label={getEditorToolbarTooltipLabel(ariaLabel)}
      shortcutLabel={shortcutLabel}
    >
      {button}
    </ToolbarActionTooltip>
  );
}

function EditorEmojiToolbarControl({
  ariaLabel,
  isOpen,
  recentEmojis,
  onOpenChange,
  onSelectEmoji,
}: {
  readonly ariaLabel: string;
  readonly isOpen: boolean;
  readonly recentEmojis: readonly string[];
  readonly onOpenChange: (open: boolean) => void;
  readonly onSelectEmoji: (emoji: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<EditorEmojiCategoryId>("smileys");
  const emojiSectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const hasRecentEmojis = recentEmojis.length > 0;
  const normalizedSearchQuery = useMemo(
    () => normalizeEditorEmojiText(searchQuery.trim()),
    [searchQuery]
  );
  const recentEmojiItems = useMemo(
    () =>
      recentEmojis
        .map((emoji) => getEditorEmojiByValue(emoji))
        .filter((item): item is EditorEmojiItem => item !== undefined),
    [recentEmojis]
  );
  const categoryOptions = useMemo<readonly EditorEmojiCategoryOption[]>(
    () =>
      hasRecentEmojis && !normalizedSearchQuery
        ? [editorEmojiRecentCategoryOption, ...editorEmojiCategoryOptions]
        : editorEmojiCategoryOptions,
    [hasRecentEmojis, normalizedSearchQuery]
  );
  const emojiSections = useMemo<readonly EditorEmojiSection[]>(() => {
    const dataSections = editorEmojiCategoryOptions.flatMap((categoryOption) => {
      const categoryItems = editorEmojiItemsByCategory.get(categoryOption.id);
      const items =
        categoryItems?.filter(
          (item) =>
            !normalizedSearchQuery ||
            getEditorEmojiSearchValue(item).includes(normalizedSearchQuery)
        ) ?? [];

      if (items.length === 0) return [];

      return [
        {
          id: categoryOption.id,
          label: categoryOption.label,
          items,
        },
      ];
    });

    if (normalizedSearchQuery || recentEmojiItems.length === 0) return dataSections;

    return [
      {
        id: "recent",
        label: editorEmojiRecentCategoryOption.label,
        items: recentEmojiItems,
      },
      ...dataSections,
    ];
  }, [normalizedSearchQuery, recentEmojiItems]);
  const hasEmojiSections = emojiSections.length > 0;

  const handleCategorySelect = useCallback((categoryId: EditorEmojiCategoryId) => {
    setActiveCategory(categoryId);
    emojiSectionRefs.current[categoryId]?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (activeCategory === "recent" && (!hasRecentEmojis || normalizedSearchQuery)) {
      setActiveCategory("smileys");
    }
  }, [activeCategory, hasRecentEmojis, normalizedSearchQuery]);

  useEffect(() => {
    if (isOpen) return;

    setSearchQuery("");
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <span className="group/toolbar-tooltip relative inline-flex">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:ring-primary/20 flex size-8 cursor-pointer items-center justify-center rounded-md p-0 transition duration-100 ease-linear outline-none focus-visible:ring-3"
            onMouseDown={(event) => event.preventDefault()}
          >
            <EmojiEditorIcon />
          </button>
        </PopoverTrigger>
        <ToolbarActionTooltipBubble label={getEditorToolbarTooltipLabel(ariaLabel)} />
      </span>
      <PopoverContent
        align="start"
        side="bottom"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="z-50 w-[720px] max-w-[calc(100vw-2rem)] gap-3 rounded-[10px] border border-[#e9eaeb] bg-white p-3 shadow-[0px_8px_12px_rgba(0,0,0,0.12)]"
      >
        <div className="flex flex-col gap-3">
          <div
            className="grid gap-1"
            role="tablist"
            aria-label="Categorias de emoji"
            style={{ gridTemplateColumns: `repeat(${categoryOptions.length}, minmax(0, 1fr))` }}
          >
            {categoryOptions.map((categoryOption) => (
              <EditorEmojiCategoryTab
                key={categoryOption.id}
                categoryOption={categoryOption}
                active={activeCategory === categoryOption.id}
                onSelect={() => handleCategorySelect(categoryOption.id)}
              />
            ))}
          </div>

          <input
            aria-label="Buscar emoji"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="focus:border-primary focus:ring-primary/20 h-9 rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none placeholder:text-[#94a3b8] focus:ring-3"
            placeholder="Buscar emoji"
          />

          <div
            className="max-h-[360px] overflow-y-auto pr-1"
            role="listbox"
            aria-label="Lista de emojis"
          >
            {emojiSections.map((section) => (
              <section
                key={section.id}
                ref={(sectionElement) => {
                  emojiSectionRefs.current[section.id] = sectionElement;
                }}
                className="scroll-mt-2 pb-3 last:pb-0"
              >
                <p className="sticky top-0 z-10 bg-white py-1 font-['Helvetica_Neue:Medium',sans-serif] text-xs leading-4 text-[#717680]">
                  {section.label}
                </p>
                <div className="grid grid-cols-8 gap-1 sm:grid-cols-10 md:grid-cols-12">
                  {section.items.map((item) => (
                    <button
                      key={`${section.id}-${item.emoji}`}
                      type="button"
                      role="option"
                      aria-label={`Inserir emoji ${item.name} ${item.emoji}`}
                      className="focus-visible:ring-primary/20 flex size-8 items-center justify-center rounded-[8px] font-['Helvetica_Neue:Regular',sans-serif] text-lg leading-none transition-colors hover:bg-[#f8fafc] focus-visible:ring-3 focus-visible:outline-none"
                      style={{ fontFamily: editorEmojiFontFamily }}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onSelectEmoji(item.emoji)}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {!hasEmojiSections ? (
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#717680]">
              Nenhum emoji encontrado.
            </p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EditorEmojiCategoryTab({
  categoryOption,
  active,
  onSelect,
}: {
  readonly categoryOption: EditorEmojiCategoryOption;
  readonly active: boolean;
  readonly onSelect: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            role="tab"
            aria-label={categoryOption.label}
            aria-selected={active}
            className={`focus-visible:ring-primary/20 relative flex h-8 min-w-0 items-center justify-center rounded-[6px] transition-colors outline-none focus-visible:ring-3 ${
              active
                ? "bg-[#eff6ff] text-[#0b5ed7]"
                : "text-[#a4a7ae] hover:bg-[#f8fafc] hover:text-[#535862]"
            }`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onSelect}
          >
            <EditorEmojiCategoryIcon categoryId={categoryOption.id} />
            <span
              aria-hidden="true"
              className={`absolute bottom-0.5 h-0.5 w-5 rounded-full transition-colors ${
                active ? "bg-[#0b5ed7]" : "bg-transparent"
              }`}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={6}
          className="rounded-[8px] bg-[#181d27] px-2.5 py-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-white shadow-[0px_4px_10px_rgba(0,0,0,0.16)]"
        >
          {categoryOption.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function EditorEmojiCategoryIcon({ categoryId }: { readonly categoryId: EditorEmojiCategoryId }) {
  switch (categoryId) {
    case "recent":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.67" />
          <path
            d="M10 5.833V10L12.5 12.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "smileys":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.67" />
          <path
            d="M7.083 12.083C7.917 13.056 8.889 13.542 10 13.542C11.111 13.542 12.083 13.056 12.917 12.083M7.5 7.5H7.508M12.5 7.5H12.508"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "nature":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M16.667 3.333C10.833 3.333 5 6.667 5 12.5C5 14.341 6.493 15.833 8.333 15.833C14.167 15.833 16.667 9.167 16.667 3.333Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M3.333 16.667C5.833 11.667 9.167 8.333 13.333 6.667"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "food":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M5 4.167V8.75C5 10.131 6.119 11.25 7.5 11.25H8.333V16.667M12.5 4.167V16.667M15 4.167V8.333C15 9.254 14.254 10 13.333 10H12.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M7.5 4.167V8.333M10 4.167V8.333"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "travel":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.67" />
          <path
            d="M2.917 10H17.083M10 2.5C11.875 4.531 12.813 7.031 12.813 10C12.813 12.969 11.875 15.469 10 17.5C8.125 15.469 7.188 12.969 7.188 10C7.188 7.031 8.125 4.531 10 2.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "activities":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M4.167 13.333H3.333C2.873 13.333 2.5 12.96 2.5 12.5V10.833C2.5 9.913 3.246 9.167 4.167 9.167H5L6.076 6.478C6.329 5.846 6.941 5.833 7.622 5.833H12.378C13.059 5.833 13.671 5.846 13.924 6.478L15 9.167H15.833C16.754 9.167 17.5 9.913 17.5 10.833V12.5C17.5 12.96 17.127 13.333 16.667 13.333H15.833"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
          <path
            d="M6.25 14.167C6.94 14.167 7.5 13.607 7.5 12.917C7.5 12.226 6.94 11.667 6.25 11.667C5.56 11.667 5 12.226 5 12.917C5 13.607 5.56 14.167 6.25 14.167ZM13.75 14.167C14.44 14.167 15 13.607 15 12.917C15 12.226 14.44 11.667 13.75 11.667C13.06 11.667 12.5 12.226 12.5 12.917C12.5 13.607 13.06 14.167 13.75 14.167Z"
            stroke="currentColor"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "objects":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7.917 15H12.083M8.333 17.5H11.667M13.333 11.667C14.209 10.843 14.583 9.956 14.583 8.75C14.583 6.219 12.531 4.167 10 4.167C7.469 4.167 5.417 6.219 5.417 8.75C5.417 9.956 5.791 10.843 6.667 11.667C7.259 12.224 7.5 12.719 7.5 13.333H12.5C12.5 12.719 12.741 12.224 13.333 11.667Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "symbols":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M6.667 4.167L13.333 15.833M6.25 7.083C7.17 7.083 7.917 6.337 7.917 5.417C7.917 4.496 7.17 3.75 6.25 3.75C5.33 3.75 4.583 4.496 4.583 5.417C4.583 6.337 5.33 7.083 6.25 7.083ZM13.75 16.25C14.67 16.25 15.417 15.504 15.417 14.583C15.417 13.663 14.67 12.917 13.75 12.917C12.83 12.917 12.083 13.663 12.083 14.583C12.083 15.504 12.83 16.25 13.75 16.25Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    case "flags":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M5 17.5V3.333M5 4.167H13.333L12.5 7.083L13.333 10H5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.67"
          />
        </svg>
      );
    default: {
      const exhaustiveCategory: never = categoryId;
      return exhaustiveCategory;
    }
  }
}

function EditorSourceDialog({
  open,
  title,
  description,
  source,
  onOpenChange,
  onSourceChange,
}: {
  readonly open: boolean;
  readonly title: string;
  readonly description: string;
  readonly source: string;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSourceChange: (value: string) => void;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | null>(null);

  const clearCopiedTimeout = useCallback(() => {
    if (copiedTimeoutRef.current === null) return;
    window.clearTimeout(copiedTimeoutRef.current);
    copiedTimeoutRef.current = null;
  }, []);

  useEffect(() => clearCopiedTimeout, [clearCopiedTimeout]);

  useEffect(() => {
    if (open) return;

    clearCopiedTimeout();
    setIsCopied(false);
  }, [clearCopiedTimeout, open]);

  const copySource = () => {
    clearCopiedTimeout();
    setIsCopied(true);
    copiedTimeoutRef.current = window.setTimeout(() => {
      setIsCopied(false);
      copiedTimeoutRef.current = null;
    }, 2_000);

    if (typeof navigator === "undefined") return;
    void navigator.clipboard?.writeText(source).catch(() => undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl border border-[#e9eaeb] bg-white p-0 shadow-xl sm:max-w-[640px]"
      >
        <DialogHeader className="gap-2 px-6 pt-6 pb-5">
          <DialogTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
            {title}
          </DialogTitle>
          <DialogDescription className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#535862]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-5">
          <label className="flex flex-col gap-1.5">
            <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
              Código fonte
            </span>
            <textarea
              className="focus:border-primary focus:ring-primary/20 min-h-[280px] w-full resize-y rounded-[8px] border border-[#cbd5e1] bg-white px-3 py-2 font-mono text-sm leading-5 text-[#181d27] transition-colors outline-none placeholder:text-slate-400 focus:ring-3"
              value={source}
              spellCheck={false}
              onChange={(event) => onSourceChange(event.target.value)}
            />
          </label>
        </div>
        <DialogFooter className="border-t border-[#e9eaeb] px-6 py-4">
          <button
            type="button"
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm whitespace-nowrap text-[#252b37] transition-colors hover:bg-[#f8fafc]"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </button>
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-5 font-['Helvetica_Neue:Medium',sans-serif] text-sm whitespace-nowrap transition-colors"
            onClick={copySource}
          >
            {isCopied ? "Código copiado" : "Copiar código"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToolbarDivider() {
  return (
    <div className="p-1.5" aria-hidden="true">
      <div className="h-full w-px rounded-full bg-[#e9eaeb]" />
    </div>
  );
}

function SourceCodeEditorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17 8L18.8398 9.85008C19.6133 10.6279 20 11.0168 20 11.5C20 11.9832 19.6133 12.3721 18.8398 13.1499L17 15"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8L5.16019 9.85008C4.38673 10.6279 4 11.0168 4 11.5C4 11.9832 4.38673 12.3721 5.16019 13.1499L7 15"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 4L9.5 20"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AssistantEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.74984 18.3337V14.167M3.74984 5.83366V1.66699M1.6665 3.75033H5.83317M1.6665 16.2503H5.83317M10.8332 2.50033L9.38802 6.25771C9.15301 6.86874 9.03551 7.17425 8.85278 7.43123C8.69083 7.65899 8.49184 7.85798 8.26408 8.01993C8.00709 8.20266 7.70158 8.32017 7.09055 8.55518L3.33317 10.0003L7.09056 11.4455C7.70158 11.6805 8.00709 11.798 8.26408 11.9807C8.49184 12.1427 8.69083 12.3417 8.85278 12.5694C9.03551 12.8264 9.15301 13.1319 9.38802 13.7429L10.8332 17.5003L12.2783 13.7429C12.5133 13.1319 12.6308 12.8264 12.8136 12.5694C12.9755 12.3417 13.1745 12.1427 13.4023 11.9807C13.6592 11.798 13.9648 11.6805 14.5758 11.4455L18.3332 10.0003L14.5758 8.55518C13.9648 8.32017 13.6592 8.20266 13.4023 8.01993C13.1745 7.85798 12.9755 7.65899 12.8136 7.43123C12.6308 7.17425 12.5133 6.86874 12.2783 6.25771L10.8332 2.50033Z"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoldEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 9.99967H11.6667C13.5076 9.99967 15 8.50729 15 6.66634C15 4.82539 13.5076 3.33301 11.6667 3.33301H5V9.99967ZM5 9.99967H12.5C14.3409 9.99967 15.8333 11.4921 15.8333 13.333C15.8333 15.174 14.3409 16.6663 12.5 16.6663H5V9.99967Z"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ItalicEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M15.8332 3.33301H8.33317M11.6665 16.6663H4.1665M12.4998 3.33301L7.49984 16.6663"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnderlineEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M15.0002 3.33301V9.16634C15.0002 11.9278 12.7616 14.1663 10.0002 14.1663C7.23874 14.1663 5.00016 11.9278 5.00016 9.16634V3.33301M3.3335 17.4997H16.6668"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StrikethroughEditorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 20H5"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3L21 21"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 7C19 6.36778 19 5.95381 18.9194 5.6768C18.7518 5.10062 18.3066 4.60428 17.7541 4.37789C17.4886 4.26905 17.1885 4.23819 16.5884 4.17648C15.1695 4.03054 13.3874 4 12 4H8"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4L11.2 7.20003M8 20.0008L10.4001 10.4001"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmojiEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
        stroke="#A4A7AE"
        strokeWidth="1.67"
      />
      <path
        d="M7.0835 8.33301H7.091M12.9168 8.33301H12.9243"
        stroke="#A4A7AE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.0835 11.25C7.66683 12.3333 8.64599 13.3333 10.0002 13.3333C11.3543 13.3333 12.3335 12.3333 12.9168 11.25"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlignLeftEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2.5 2.5H17.5"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 7.5H9.16667"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12.5H17.5"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 17.5H9.16667"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlignCenterEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2.5 2.5H17.5"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66675 7.5H13.3334"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12.5H17.5"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66675 17.5H13.3334"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BulletListEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.66675 4.16699L16.6667 4.16699"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
      />
      <path
        d="M3.33325 4.16699H3.34074"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33325 10H3.34074"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33325 15.833H3.34074"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.66675 10L16.6667 10" stroke="#A4A7AE" strokeWidth="1.67" strokeLinecap="round" />
      <path
        d="M6.66675 15.833L16.6667 15.833"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrderedListEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 6L21 6" stroke="#A4A7AE" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 12L21 12" stroke="#A4A7AE" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 18L21 18" stroke="#A4A7AE" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M3 15H4.5C4.77879 15 4.91819 15 5.03411 15.0231C5.51014 15.1177 5.88225 15.4899 5.97694 15.9659C6 16.0818 6 16.2212 6 16.5C6 16.7788 6 16.9182 5.97694 17.0341C5.88225 17.5101 5.51014 17.8823 5.03411 17.9769C4.91819 18 4.77879 18 4.5 18C4.22121 18 4.08181 18 3.96589 18.0231C3.48986 18.1177 3.11775 18.4899 3.02306 18.9659C3 19.0818 3 19.2212 3 19.5V20.4C3 20.6828 3 20.8243 3.08787 20.9121C3.17574 21 3.31716 21 3.6 21H6"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3H4.2C4.36569 3 4.5 3.13431 4.5 3.3V9M4.5 9H3M4.5 9H6"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccordionEditorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5.5L21 5.5" stroke="#A4A7AE" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M5.4 16.8926C6.46667 17.607 7 17.9642 7 18.5C7 19.0358 6.46667 19.393 5.4 20.1074C4.33333 20.8218 3.8 21.1789 3.4 20.9111C3 20.6432 3 19.9288 3 18.5C3 17.0712 3 16.3568 3.4 16.0889C3.8 15.8211 4.33333 16.1782 5.4 16.8926Z"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5.4 3.89263C6.46667 4.60702 7 4.96421 7 5.5C7 6.03579 6.46667 6.39298 5.4 7.10737C4.33333 7.82176 3.8 8.17895 3.4 7.91105C3 7.64316 3 6.92877 3 5.5C3 4.07123 3 3.35684 3.4 3.08895C3.8 2.82105 4.33333 3.17824 5.4 3.89263Z"
        stroke="#A4A7AE"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M11 12L21 12" stroke="#A4A7AE" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 18.5L21 18.5" stroke="#A4A7AE" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M8.33325 11.0238C8.45127 11.2171 8.59132 11.4 8.75339 11.5687C9.75965 12.616 11.2934 12.7797 12.4646 12.0598C12.6816 11.9264 12.8861 11.7627 13.0726 11.5687L15.7721 8.75919C16.9648 7.51788 16.9648 5.50531 15.7721 4.26399C14.5793 3.02268 12.6456 3.02268 11.4529 4.26399L10.8583 4.88283"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
      />
      <path
        d="M9.14184 15.1166L8.54702 15.7357C7.3543 16.977 5.42051 16.977 4.22779 15.7357C3.03507 14.4944 3.03507 12.4818 4.22779 11.2405L6.92731 8.43099C8.12003 7.18967 10.0538 7.18967 11.2465 8.43098C11.4086 8.59961 11.5486 8.78247 11.6666 8.9757"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ImageEditorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M11.6667 2.5H8.33341C5.19072 2.5 3.61937 2.5 2.64306 3.47631C1.66675 4.45262 1.66675 6.02397 1.66675 9.16667V10.8333C1.66675 13.976 1.66675 15.5474 2.64306 16.5237C3.61937 17.5 5.19072 17.5 8.33341 17.5H11.6667C14.8094 17.5 16.3808 17.5 17.3571 16.5237C18.3334 15.5474 18.3334 13.976 18.3334 10.8333V9.16667C18.3334 6.02397 18.3334 4.45262 17.3571 3.47631C16.3808 2.5 14.8094 2.5 11.6667 2.5Z"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="7.08325"
        cy="7.08301"
        r="1.25"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9166 14.167L13.6233 9.48338C13.4385 9.28178 13.1775 9.16699 12.9041 9.16699C12.6453 9.16699 12.3971 9.26979 12.2142 9.45276L8.33325 13.3337L6.53265 11.5331C6.35162 11.352 6.10609 11.2503 5.85007 11.2503C5.57434 11.2503 5.31178 11.3682 5.12859 11.5743L2.08325 15.0003"
        stroke="#A4A7AE"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getEditorColorSwatchStyle(color: string): CSSProperties {
  if (color === editorDefaultTextBackgroundColor) {
    return {
      backgroundColor: "#FFFFFF",
      backgroundImage:
        "linear-gradient(45deg, #d5d7da 25%, transparent 25%), linear-gradient(-45deg, #d5d7da 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d5d7da 75%), linear-gradient(-45deg, transparent 75%, #d5d7da 75%)",
      backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
      backgroundSize: "12px 12px",
    };
  }

  return { backgroundColor: color };
}

function TextColorToolbarControl({
  ariaLabel,
  selectedTextColor,
  selectedTextBackgroundColor,
  customTextColor,
  customTextBackgroundColor,
  isOpen,
  onOpenChange,
  onCustomTextColorChange,
  onCustomTextBackgroundColorChange,
  onSelectTextColor,
  onSelectTextBackgroundColor,
  onRestoreDefaultColors,
}: {
  readonly ariaLabel: string;
  readonly selectedTextColor: string;
  readonly selectedTextBackgroundColor: string;
  readonly customTextColor: string;
  readonly customTextBackgroundColor: string;
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCustomTextColorChange: (color: string) => void;
  readonly onCustomTextBackgroundColorChange: (color: string) => void;
  readonly onSelectTextColor: (color: string) => void;
  readonly onSelectTextBackgroundColor: (color: string) => void;
  readonly onRestoreDefaultColors: () => void;
}) {
  const activeTextColor = isValidEditorHexColor(selectedTextColor)
    ? selectedTextColor
    : editorDefaultTextColor;
  const activeTextBackgroundColor =
    selectedTextBackgroundColor === editorDefaultTextBackgroundColor ||
    isValidEditorHexColor(selectedTextBackgroundColor)
      ? selectedTextBackgroundColor
      : editorDefaultTextBackgroundColor;

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <span className="group/toolbar-tooltip relative inline-flex">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:ring-primary/20 flex size-8 cursor-pointer items-center justify-center rounded-md p-0 transition duration-100 ease-linear outline-none focus-visible:ring-3"
            onMouseDown={(event) => event.preventDefault()}
          >
            <span className="relative size-4" aria-hidden="true">
              <span
                className="absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset"
                style={{ backgroundColor: activeTextColor }}
              />
              <span
                className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border border-white ring-1 ring-black/10"
                style={getEditorColorSwatchStyle(activeTextBackgroundColor)}
              />
            </span>
          </button>
        </PopoverTrigger>
        <ToolbarActionTooltipBubble label={getEditorToolbarTooltipLabel(ariaLabel)} />
      </span>
      <PopoverContent
        align="start"
        side="bottom"
        className="z-50 w-[238px] gap-3 rounded-[10px] border border-[#e9eaeb] bg-white p-3 shadow-[0px_8px_12px_rgba(0,0,0,0.12)]"
      >
        <Tabs defaultValue="text" className="gap-3">
          <TabsList
            aria-label="Tipo de cor"
            className="grid h-8 w-full grid-cols-2 rounded-[8px] bg-[#f5f5f5] p-1"
          >
            <TabsTrigger
              value="text"
              className="h-6 rounded-[6px] px-2 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#535862] data-active:bg-white data-active:text-[#181d27] data-active:shadow-[0px_1px_2px_rgba(10,13,18,0.08)]"
            >
              Texto
            </TabsTrigger>
            <TabsTrigger
              value="background"
              className="h-6 rounded-[6px] px-2 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#535862] data-active:bg-white data-active:text-[#181d27] data-active:shadow-[0px_1px_2px_rgba(10,13,18,0.08)]"
            >
              Fundo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="flex flex-col gap-3">
            <div className="grid grid-cols-8 gap-2">
              {editorTextColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  aria-label={`Selecionar cor ${color.label}`}
                  className={`flex size-5 items-center justify-center rounded-full transition-shadow hover:ring-2 hover:ring-[#d5d7da] hover:ring-offset-2 ${
                    selectedTextColor === color.value ? "ring-2 ring-[#181d27] ring-offset-2" : ""
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectTextColor(color.value)}
                >
                  <span
                    className="size-4 rounded-full border border-black/10"
                    style={{ backgroundColor: color.value }}
                  />
                </button>
              ))}
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#414651]">
                Cor personalizada
              </span>
              <input
                value={customTextColor}
                onChange={(event) => {
                  const nextColor = event.target.value.toUpperCase();
                  onCustomTextColorChange(nextColor);
                  if (isValidEditorHexColor(nextColor)) onSelectTextColor(nextColor);
                }}
                className="focus:border-primary focus:ring-primary/20 h-9 rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none focus:ring-3"
                placeholder={editorDefaultTextColor}
              />
            </label>
          </TabsContent>

          <TabsContent value="background" className="flex flex-col gap-3">
            <div className="grid grid-cols-8 gap-2">
              {editorTextBackgroundColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  aria-label={`Selecionar cor de fundo ${color.label}`}
                  className={`flex size-5 items-center justify-center rounded-full transition-shadow hover:ring-2 hover:ring-[#d5d7da] hover:ring-offset-2 ${
                    selectedTextBackgroundColor === color.value
                      ? "ring-2 ring-[#181d27] ring-offset-2"
                      : ""
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectTextBackgroundColor(color.value)}
                >
                  <span
                    className="size-4 rounded-full border border-black/10"
                    style={getEditorColorSwatchStyle(color.value)}
                  />
                </button>
              ))}
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#414651]">
                Cor de fundo personalizada
              </span>
              <input
                value={customTextBackgroundColor}
                onChange={(event) => {
                  const nextColor = event.target.value.toUpperCase();
                  onCustomTextBackgroundColorChange(nextColor);
                  if (isValidEditorHexColor(nextColor)) onSelectTextBackgroundColor(nextColor);
                }}
                className="focus:border-primary focus:ring-primary/20 h-9 rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors outline-none focus:ring-3"
                placeholder={editorDefaultCustomTextBackgroundColor}
              />
            </label>
          </TabsContent>
        </Tabs>

        <button
          type="button"
          className="focus-visible:ring-primary/20 flex h-9 w-full items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors hover:bg-[#f8fafc] hover:text-[#252b37] focus-visible:ring-3 focus-visible:outline-none"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onRestoreDefaultColors}
        >
          Restaurar padrão
        </button>
      </PopoverContent>
    </Popover>
  );
}

function CategoryButton({
  icon,
  iconNode,
  title,
  description,
  active,
  compact,
  compactHeight = "default",
  onClick,
}: {
  icon?: HugeIconData;
  iconNode?: ReactNode;
  title: string;
  description: string;
  active?: boolean;
  compact?: boolean;
  compactHeight?: "default" | "short";
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active ?? false}
      onClick={onClick}
      className={`focus-visible:ring-primary/20 flex ${
        compact ? (compactHeight === "short" ? "min-h-[74px]" : "min-h-[78px]") : "min-h-[89px]"
      } items-start gap-2.5 rounded-xl border p-3 text-left transition-colors focus-visible:ring-3 ${
        active
          ? "border-[#1b71fd] bg-[#eff6ff] text-[#0b5ed7]"
          : "border-[#e9eaeb] bg-white text-[#535862] hover:bg-[#f8fafc]"
      }`}
    >
      {iconNode ??
        (icon ? (
          <HugeiconsIcon icon={icon} size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
        ) : null)}
      <span className="min-w-0">
        <span className="block font-['Helvetica_Neue:Regular',sans-serif] text-sm">{title}</span>
        <span
          className={`mt-1 block font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] ${
            active ? "text-[#1570ef]" : "text-[#717680]"
          }`}
        >
          {description}
        </span>
      </span>
    </button>
  );
}

function ProductStockRuleIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2.0835 6.25V11.25C2.0835 14.3927 2.0835 15.964 3.05981 16.9404C4.03612 17.9167 5.60747 17.9167 8.75016 17.9167H10.8335M17.9168 10.8333V6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.22441 4.42852L2.0835 6.24967H17.9168L16.8733 4.51053C16.1619 3.32485 15.8062 2.73201 15.2331 2.40751C14.66 2.08301 13.9686 2.08301 12.5859 2.08301H7.46159C6.10848 2.08301 5.43193 2.08301 4.86694 2.39576C4.30195 2.70851 3.94277 3.28185 3.22441 4.42852Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.24967V2.08301"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3335 8.75H11.6668"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9165 15.4164C17.9165 15.4164 16.0753 17.9163 15.4165 17.9163C14.7577 17.9163 12.9165 15.4163 12.9165 15.4163M15.4165 17.4997V12.083"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CustomRuleStockIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9.1665 18.333C8.48467 18.333 7.83333 18.0578 6.53061 17.5076C3.28787 16.1378 1.6665 15.4528 1.6665 14.3008C1.6665 13.9782 1.6665 8.38676 1.6665 5.83301M9.1665 18.333V9.46201M9.1665 18.333C9.45017 18.333 9.70509 18.2853 9.99984 18.1901M16.6665 5.83301V9.58301"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.10477 8.07647L3.67044 6.89853C2.33448 6.25208 1.6665 5.92885 1.6665 5.41699C1.6665 4.90513 2.33448 4.58191 3.67044 3.93545L6.10477 2.75751C7.6072 2.0305 8.35842 1.66699 9.1665 1.66699C9.97459 1.66699 10.7258 2.03049 12.2283 2.75751L14.6626 3.93545C15.9985 4.58191 16.6665 4.90513 16.6665 5.41699C16.6665 5.92885 15.9985 6.25208 14.6626 6.89853L12.2283 8.07647C10.7258 8.80349 9.97459 9.16699 9.1665 9.16699C8.35842 9.16699 7.6072 8.80349 6.10477 8.07647Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.1665 10L5.83317 10.8333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 3.33301L5 7.49967"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.7767 16.7994L18.3332 18.3337M17.6727 14.664C17.6727 16.3192 16.3281 17.661 14.6696 17.661C13.011 17.661 11.6665 16.3192 11.6665 14.664C11.6665 13.0088 13.011 11.667 14.6696 11.667C16.3281 11.667 17.6727 13.0088 17.6727 14.664Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProductStockChipIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11.8695 2.71211L9.07294 1.6382C8.5431 1.43474 8.27818 1.33301 8 1.33301C7.72182 1.33301 7.4569 1.43474 6.92706 1.6382L4.13048 2.71211C2.71016 3.25753 2 3.53024 2 3.99967C2 4.46911 2.71016 4.74182 4.13048 5.28724L6.92706 6.36115C7.4569 6.56461 7.72182 6.66634 8 6.66634C8.27818 6.66634 8.5431 6.56461 9.07294 6.36115L11.8695 5.28724C13.2898 4.74182 14 4.46911 14 3.99967C14 3.53024 13.2898 3.25753 11.8695 2.71211Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4V12C14 12.4694 13.2898 12.7421 11.8695 13.2876L9.07294 14.3615C8.5431 14.5649 8.27818 14.6667 8 14.6667C7.72182 14.6667 7.4569 14.5649 6.92706 14.3615L4.13048 13.2876C2.71016 12.7421 2 12.4694 2 12V4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.66699V14.667"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9998 2.66699L4.6665 5.33366V7.00033"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.6665 10.7277V10.17C3.6665 9.70646 3.6665 9.47469 3.81634 9.37439C3.96618 9.2741 4.17605 9.3654 4.59578 9.548L5.59578 9.98303C5.79175 10.0683 5.88973 10.1109 5.94478 10.1957C5.99984 10.2804 5.99984 10.3886 5.99984 10.605V11.1627C5.99984 11.6262 5.99984 11.858 5.85 11.9583C5.70016 12.0586 5.49029 11.9673 5.07056 11.7847L4.07056 11.3497C3.87459 11.2644 3.77661 11.2218 3.72156 11.137C3.6665 11.0523 3.6665 10.9441 3.6665 10.7277Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScheduleActionButton({
  icon,
  label,
  destructive,
  onClick,
}: {
  icon: HugeIconData;
  label: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`focus-visible:ring-primary/20 flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-white transition-colors hover:bg-[#f8fafc] focus-visible:ring-3 ${
        destructive ? "text-destructive hover:bg-destructive/10" : "text-primary"
      }`}
    >
      <HugeiconsIcon icon={icon} size={16} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

type ScheduleRowReorder = {
  readonly enabled: boolean;
  readonly active: boolean;
  readonly offsetY: number;
  readonly onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  readonly onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  readonly onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  readonly onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

function ScheduleRow({
  title,
  titleDetail,
  description,
  deletable,
  reorder,
  onEdit,
  onDelete,
}: {
  title: string;
  titleDetail?: string;
  description: string;
  deletable?: boolean;
  reorder?: ScheduleRowReorder;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const trimmedTitleDetail = titleDetail?.trim();
  const rowStyle: CSSProperties | undefined = reorder
    ? {
        transform: `translateY(${reorder.offsetY}px)`,
        transformOrigin: "50% 50% 0px",
        zIndex: reorder.active ? 20 : undefined,
        userSelect: reorder.active ? "none" : undefined,
        touchAction: reorder.enabled ? "pan-x" : undefined,
      }
    : undefined;

  return (
    <div
      data-route-day-card={reorder?.enabled ? "true" : undefined}
      style={rowStyle}
      className={`relative flex items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#f5f5f5]/40 px-4 py-3 ${
        reorder?.active ? "shadow-sm" : "transition-transform duration-150 ease-out"
      }`}
    >
      <button
        type="button"
        aria-label={reorder?.enabled ? `Reordenar ${title}` : `${title} sem reordenação disponível`}
        draggable={false}
        data-route-day-reorder-handle={reorder?.enabled ? "true" : undefined}
        onPointerDown={reorder?.onPointerDown}
        onPointerMove={reorder?.onPointerMove}
        onPointerUp={reorder?.onPointerUp}
        onPointerCancel={reorder?.onPointerCancel}
        onKeyDown={reorder?.onKeyDown}
        className={`focus-visible:ring-primary/20 flex size-5 shrink-0 items-center justify-center rounded-md text-[#a4a7ae] outline-none focus-visible:ring-3 ${
          reorder?.enabled ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-default"
        }`}
      >
        <HugeiconsIcon icon={More01Icon} size={20} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1">
          <p className="shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#0a0a0a]">
            {title}
          </p>
          {trimmedTitleDetail ? (
            <>
              <span className="shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#535862]">
                ·
              </span>
              <p className="min-w-0 truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#535862]">
                {trimmedTitleDetail}
              </p>
            </>
          ) : null}
        </div>
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#737373] md:truncate">
          {description}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <ScheduleActionButton icon={PencilEdit02Icon} label={`Editar ${title}`} onClick={onEdit} />
        {deletable ? (
          <ScheduleActionButton
            icon={Delete02Icon}
            label={`Excluir ${title}`}
            destructive
            onClick={onDelete}
          />
        ) : null}
      </div>
    </div>
  );
}

function ProductCollaboratorsSection({
  enabled,
  onEnabledChange,
}: {
  readonly enabled: boolean;
  readonly onEnabledChange: (enabled: boolean) => void;
}) {
  const [isCollaboratorDropdownOpen, setIsCollaboratorDropdownOpen] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState<
    readonly SelectedProductCollaborator[]
  >([]);

  const addSelectedCollaborator = (collaborator: ProductCollaboratorOption) => {
    setSelectedCollaborators((currentCollaborators) => {
      if (currentCollaborators.some(({ name }) => name === collaborator.name)) {
        return currentCollaborators;
      }

      return [
        ...currentCollaborators,
        {
          ...collaborator,
          hasInsurance: true,
          isFixed: true,
        },
      ];
    });
    setIsCollaboratorDropdownOpen(false);
  };

  const updateSelectedCollaborator = (
    collaboratorName: string,
    update: (collaborator: SelectedProductCollaborator) => SelectedProductCollaborator
  ) => {
    setSelectedCollaborators((currentCollaborators) =>
      currentCollaborators.map((collaborator) =>
        collaborator.name === collaboratorName ? update(collaborator) : collaborator
      )
    );
  };

  const removeSelectedCollaborator = (collaboratorName: string) => {
    setSelectedCollaborators((currentCollaborators) =>
      currentCollaborators.filter(({ name }) => name !== collaboratorName)
    );
  };

  return (
    <div className="flex flex-col gap-2.5">
      <SectionLabel>COLABORADORES</SectionLabel>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
              Habilitar atribuição de colaboradores
            </p>
            <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
              Os colaboradores vinculados aqui ficam alocados automaticamente em toda reserva deste
              produto. Para equipes que variam, deixe desabilitado e escale pela agenda.
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
            aria-label="Habilitar atribuição de colaboradores"
          />
        </div>
        {enabled ? (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <button
                type="button"
                role="combobox"
                aria-expanded={isCollaboratorDropdownOpen}
                aria-label="Buscar ou adicionar membro"
                onClick={() => setIsCollaboratorDropdownOpen((isOpen) => !isOpen)}
                className="focus-visible:border-ring focus-visible:ring-ring/30 flex h-10 w-full items-center justify-between gap-1.5 rounded-[8px] border border-[#cbd5e1] bg-white px-3 py-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#717680] transition-[color,box-shadow,background-color] outline-none hover:bg-[#f8fafc] focus-visible:ring-3"
              >
                <span className="min-w-0 truncate">Buscar ou adicionar membro</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={`shrink-0 text-[#717680] transition-transform ${
                    isCollaboratorDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isCollaboratorDropdownOpen ? (
                <div className="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">
                  <div className="max-h-[200px] overflow-y-auto py-1">
                    {productCollaboratorOptions.map((collaborator) => {
                      const isAllocated = collaborator.status === "allocated";
                      return (
                        <button
                          key={collaborator.name}
                          type="button"
                          onClick={() => addSelectedCollaborator(collaborator)}
                          className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 transition-colors hover:bg-[#f8fafc]"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
                            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] text-[#0b5ed7]">
                              {collaborator.initials}
                            </p>
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[13px] text-[#252b37]">
                              {collaborator.name}
                            </p>
                            <p
                              className={`truncate font-['Helvetica_Neue:Regular',sans-serif] text-[11px] ${
                                isAllocated ? "text-[#e17c00]" : "text-[#079455]"
                              }`}
                            >
                              {isAllocated
                                ? "Alocado em outra atividade no mesmo horário"
                                : "Disponível para a atividade"}
                            </p>
                          </div>
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            size={14}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="shrink-0 text-[#0b5ed7]"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            {selectedCollaborators.length > 0 ? (
              selectedCollaborators.map((selectedCollaborator) => (
                <div
                  key={selectedCollaborator.name}
                  className="flex items-center gap-3 rounded-[10px] border border-[#f5f5f5] bg-[#fafafa] px-3 py-2.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#bfdbfe] bg-[#eff6ff]">
                    <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] leading-[16.5px] text-[#0b5ed7]">
                      {selectedCollaborator.initials}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[19.5px] text-[#252b37]">
                      {selectedCollaborator.name}
                    </p>
                    <div className="flex min-w-0 items-center gap-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[16.5px]">
                      {selectedCollaborator.isFixed ? (
                        <>
                          <span className="shrink-0 text-[#252b37]">Colaborador fixo</span>
                          <span className="shrink-0 text-[#717680]">·</span>
                        </>
                      ) : null}
                      <span
                        className={`min-w-0 truncate ${
                          selectedCollaborator.hasInsurance ? "text-[#0b5ed7]" : "text-[#DC6803]"
                        }`}
                      >
                        {selectedCollaborator.hasInsurance ? "Seguro contratado" : "Sem seguro"}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Ações de ${selectedCollaborator.name}`}
                        className="flex size-8 shrink-0 items-center justify-center rounded-[6px] border border-[#e9eaeb] bg-white text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#535862]"
                      >
                        <HugeiconsIcon
                          icon={MoreVerticalIcon}
                          size={16}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      sideOffset={4}
                      className="flex w-[220px] flex-col gap-1 rounded-[8px] border border-[#f5f5f5] bg-white p-[6px] text-[#0f172a] shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-0 before:hidden"
                    >
                      <DropdownMenuItem
                        className="h-[37px] cursor-pointer gap-2 rounded-[6px] px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0f172a] focus:bg-[#f8fafc] focus:text-[#0f172a]"
                        onSelect={() =>
                          updateSelectedCollaborator(selectedCollaborator.name, (collaborator) => ({
                            ...collaborator,
                            hasInsurance: !collaborator.hasInsurance,
                          }))
                        }
                      >
                        {selectedCollaborator.hasInsurance ? (
                          <UndoCollaboratorInsuranceIcon />
                        ) : (
                          <HireCollaboratorInsuranceIcon />
                        )}
                        {selectedCollaborator.hasInsurance ? "Desfazer seguro" : "Contratar seguro"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-[37px] cursor-pointer gap-2 rounded-[6px] px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0f172a] focus:bg-[#f8fafc] focus:text-[#0f172a]"
                        onSelect={(event) => event.preventDefault()}
                        onClick={() =>
                          updateSelectedCollaborator(selectedCollaborator.name, (collaborator) => ({
                            ...collaborator,
                            isFixed: !collaborator.isFixed,
                          }))
                        }
                      >
                        <FixedCollaboratorIcon />
                        <span className="min-w-0 flex-1">
                          {selectedCollaborator.isFixed ? "Colab. fixo" : "Colab. não fixo"}
                        </span>
                        <Switch
                          checked={selectedCollaborator.isFixed}
                          onCheckedChange={(checked) =>
                            updateSelectedCollaborator(
                              selectedCollaborator.name,
                              (collaborator) => ({
                                ...collaborator,
                                isFixed: checked,
                              })
                            )
                          }
                          onClick={(event) => event.stopPropagation()}
                          aria-label={`Colaborador fixo ${selectedCollaborator.name}`}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem className="h-[37px] cursor-pointer gap-2 rounded-[6px] px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#075e54] focus:bg-[#f8fafc] focus:text-[#075e54]">
                        <HugeiconsIcon
                          icon={WhatsappIcon}
                          size={16}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        Ligar via WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-0 bg-[#f5f5f5]" />
                      <DropdownMenuItem
                        className="h-[37px] cursor-pointer gap-2 rounded-[6px] px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#F04438] focus:bg-[#fef3f2] focus:text-[#F04438]"
                        style={{ color: "#F04438" }}
                        onSelect={() => removeSelectedCollaborator(selectedCollaborator.name)}
                      >
                        <RemoveCollaboratorIcon />
                        Remover colaborador
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-[#e9eaeb] bg-white px-6 py-6 text-center">
                <HugeiconsIcon
                  icon={AddTeamIcon}
                  size={32}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mb-2 text-[#cbd5e1]"
                />
                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[19.5px] text-[#717680]">
                  Nenhum colaborador escalado
                </p>
                <p className="mt-1 max-w-[220px] font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[16.5px] text-[#94a3b8]">
                  Busque e adicione os colaboradores responsáveis por esta saída.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ScheduleStatusBadge({ status }: { status: ScheduleStatus }) {
  const isActive = status === "Ativo";

  return (
    <span
      className={`flex h-[18px] shrink-0 items-center justify-center rounded-full border px-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-4 ${
        isActive
          ? "border-[#abefc6] bg-[#ecfdf3] text-[#079455]"
          : "border-[#e9eaeb] bg-[#f5f5f5] text-[#535862]"
      }`}
    >
      {status}
    </span>
  );
}

function UndoCollaboratorInsuranceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.2322 8.33301C13.2322 8.33301 13.3337 6.2889 13.2322 6.04376C13.1307 5.79863 12.938 5.60586 12.5526 5.22032L9.39491 2.06125C9.06232 1.72851 8.89603 1.56214 8.69 1.46356C8.64715 1.44306 8.60324 1.42486 8.55845 1.40905C8.34309 1.33301 8.10791 1.33301 7.63755 1.33301C5.47421 1.33301 4.39253 1.33301 3.65988 1.92398C3.51187 2.04337 3.37704 2.17825 3.25771 2.32633C2.66699 3.0593 2.66699 4.14144 2.66699 6.30573V9.33649C2.66699 11.8517 2.66699 13.1094 3.44804 13.8907C4.07676 14.5197 5.98451 14.3091 7.63755 14.333M8.66699 1.66649V1.99996C8.66699 3.8864 8.66699 4.82962 9.25278 5.41566C9.83857 6.0017 10.7814 6.0017 12.667 6.0017H13.0003"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14.667L10 10.667M14 10.667L10 14.667"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HireCollaboratorInsuranceIcon() {
  return (
    <svg
      className="size-4 shrink-0 text-[#414651]"
      fill="none"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        d="M16.6668 9.99984V8.88055C16.6668 8.1993 16.6668 7.85867 16.54 7.55239C16.4131 7.2461 16.1722 7.00524 15.6905 6.52353L11.7434 2.57641C11.3277 2.16067 11.1198 1.9528 10.8623 1.82962C10.8087 1.80401 10.7538 1.78127 10.6978 1.76151C10.4286 1.6665 10.1346 1.6665 9.5467 1.6665C6.84251 1.6665 5.49042 1.6665 4.5746 2.4049C4.38959 2.55407 4.22106 2.7226 4.07189 2.90761C3.3335 3.82343 3.3335 5.17552 3.3335 7.87971V11.6665C3.3335 14.8092 3.3335 16.3805 4.30981 17.3569C5.28612 18.3332 6.85747 18.3332 10.0002 18.3332M10.8335 2.08317V2.49984C10.8335 4.85686 10.8335 6.03537 11.5657 6.7676C12.298 7.49984 13.4765 7.49984 15.8335 7.49984H16.2502"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6668 14.6855V13.0429C16.6668 12.7845 16.4771 12.5701 16.231 12.5261C15.2393 12.3488 14.416 11.9544 14.0144 11.7356C13.8499 11.6461 13.6505 11.6461 13.486 11.7356C13.0843 11.9544 12.2611 12.3488 11.2693 12.5261C11.0232 12.5701 10.8335 12.7845 10.8335 13.0429V14.6855C10.8335 16.8283 12.9522 17.9971 13.5781 18.2956C13.6885 18.3483 13.8118 18.3483 13.9223 18.2956C14.5482 17.9971 16.6668 16.8283 16.6668 14.6855Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RemoveCollaboratorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 8C14.5 5.23858 12.2614 3 9.5 3C6.73858 3 4.5 5.23858 4.5 8C4.5 10.7614 6.73858 13 9.5 13C12.2614 13 14.5 10.7614 14.5 8Z"
        stroke="#F04438"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 21L18.5 18M18.5 18L21.5 15M18.5 18L15.5 15M18.5 18L21.5 21"
        stroke="#F04438"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 20C2.5 16.134 5.63401 13 9.5 13C10.775 13 11.9704 13.3409 13 13.9365"
        stroke="#F04438"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FixedCollaboratorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <g clipPath="url(#fixed-collaborator-icon-clip)">
        <path
          d="M1.66699 14.5617V13.0179C1.66699 12.199 2.00062 11.4136 2.59449 10.8345C3.18835 10.2555 3.99381 9.93015 4.83366 9.93015H6.81282M11.9587 12.2459V12.2537M3.25033 3.75471C3.25033 4.57363 3.58396 5.359 4.17782 5.93806C4.77169 6.51712 5.57714 6.84243 6.41699 6.84243C7.25684 6.84243 8.0623 6.51712 8.65616 5.93806C9.25003 5.359 9.58366 4.57363 9.58366 3.75471C9.58366 2.9358 9.25003 2.15042 8.65616 1.57136C8.0623 0.992304 7.25684 0.666992 6.41699 0.666992C5.57714 0.666992 4.77169 0.992304 4.17782 1.57136C3.58396 2.15042 3.25033 2.9358 3.25033 3.75471ZM13.6378 13.8832C13.97 13.5594 14.1963 13.1467 14.288 12.6975C14.3797 12.2483 14.3327 11.7826 14.1529 11.3594C13.9732 10.9362 13.6688 10.5745 13.2782 10.32C12.8876 10.0655 12.4284 9.92966 11.9587 9.92966C11.4889 9.92966 11.0297 10.0655 10.6391 10.32C10.2485 10.5745 9.94411 10.9362 9.76438 11.3594C9.58464 11.7826 9.53765 12.2483 9.62935 12.6975C9.72104 13.1467 9.94731 13.5594 10.2795 13.8832C10.6104 14.2064 11.1702 14.6899 11.9587 15.3337C12.791 14.6466 13.3507 14.1632 13.6378 13.8832Z"
          stroke="#141B34"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="fixed-collaborator-icon-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ConfigureScheduleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.44771 13.2189L13.219 5.44772C13.5825 5.08422 13.7642 4.90247 13.8614 4.7064C14.0462 4.33337 14.0462 3.8954 13.8614 3.52236C13.7642 3.3263 13.5825 3.14455 13.219 2.78105C12.8555 2.41755 12.6737 2.2358 12.4776 2.13864C12.1046 1.95379 11.6666 1.95379 11.2936 2.13864C11.0975 2.2358 10.9158 2.41755 10.5523 2.78105L2.78105 10.5522C2.39567 10.9376 2.20299 11.1303 2.10149 11.3753C2 11.6204 2 11.8929 2 12.4379V14H3.5621C4.1071 14 4.3796 14 4.62463 13.8985C4.86965 13.797 5.06234 13.6043 5.44771 13.2189Z"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 14H12"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66699 3.66699L12.3337 6.33366"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActiveScheduleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M14.6663 7.99967C14.6663 11.6816 11.6816 14.6663 7.99967 14.6663C4.31778 14.6663 1.33301 11.6816 1.33301 7.99967C1.33301 4.31778 4.31778 1.33301 7.99967 1.33301C11.6816 1.33301 14.6663 4.31778 14.6663 7.99967Z"
        stroke="#141B34"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function RemoveScheduleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
        stroke="#F04438"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
        stroke="#F04438"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path d="M9.5 16.5L9.5 10.5" stroke="#F04438" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M14.5 16.5L14.5 10.5" stroke="#F04438" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function TimeInputIcon({ className }: { readonly className: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10.0003" cy="10.0003" r="8.33333" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.66699V10.0003L11.6667 11.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScheduleDrawerSection({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="mx-[-24px] flex h-8 items-center border-y border-[#f0f1f3] bg-[#f9fafb] px-6">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] leading-[16.5px] tracking-[0.8px] text-[#a4a7ae] uppercase">
          {title}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ScheduleDrawerField({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[14px] text-[#0a0a0a]">
        {label}
      </span>
      {children}
    </label>
  );
}

function ScheduleConfigDrawer({
  open,
  title,
  config,
  onOpenChange,
  onSave,
}: {
  readonly open: boolean;
  readonly title: string;
  readonly config: ScheduleTimeConfig;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (config: ScheduleTimeConfig) => void;
}) {
  const [draft, setDraft] = useState<ScheduleTimeConfig>(config);
  const drawerTitle = `Configurar ${title.replace("Horário", "horário")}`;
  const closeDrawer = () => onOpenChange(false);
  const saveDrawer = () => {
    onSave(draft);
    closeDrawer();
  };

  useEffect(() => {
    if (open) {
      setDraft(config);
    }
  }, [config, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="!w-full overflow-hidden rounded-l-2xl border-[#e9eaeb] bg-white p-0 shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] sm:!w-[480px] sm:!max-w-[480px]"
      >
        <SheetHeader className="flex h-[69px] shrink-0 flex-row items-center justify-between gap-4 border-b border-[#f0f1f3] px-6 py-5">
          <div>
            <SheetTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
              {drawerTitle}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Configure os horários de início, término e a capacidade deste horário.
            </SheetDescription>
          </div>
          <button
            type="button"
            aria-label={`Fechar configuração de ${title}`}
            onClick={closeDrawer}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#414651]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-5">
          <div className="flex flex-col gap-6">
            <ScheduleDrawerSection title="HORÁRIOS">
              <ScheduleDrawerField label="Início">
                <div className="relative">
                  <input
                    className={`${scheduleDrawerInputClass} pr-10`}
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="hh:mm"
                    value={draft.startTime}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        startTime: formatTimeInput(event.target.value),
                      }))
                    }
                  />
                  <TimeInputIcon className={timeInputIconClass} />
                </div>
              </ScheduleDrawerField>
              <ScheduleDrawerField label="Término">
                <div className="relative">
                  <input
                    className={`${scheduleDrawerInputClass} pr-10`}
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="hh:mm"
                    value={draft.endTime}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        endTime: formatTimeInput(event.target.value),
                      }))
                    }
                  />
                  <TimeInputIcon className={timeInputIconClass} />
                </div>
              </ScheduleDrawerField>
            </ScheduleDrawerSection>

            <ScheduleDrawerSection title="CAPACIDADE">
              <ScheduleDrawerField label="Mínima">
                <input
                  className={scheduleDrawerInputClass}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={draft.minimumCapacity}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      minimumCapacity: onlyDigits(event.target.value),
                    }))
                  }
                />
              </ScheduleDrawerField>
              <ScheduleDrawerField label="Máxima">
                <input
                  className={scheduleDrawerInputClass}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={draft.maximumCapacity}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      maximumCapacity: onlyDigits(event.target.value),
                    }))
                  }
                />
              </ScheduleDrawerField>
            </ScheduleDrawerSection>
          </div>
        </div>

        <SheetFooter className="h-[73px] shrink-0 flex-row items-center justify-end gap-3 border-t border-[#e9eaeb] bg-white px-6 py-4">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveDrawer}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-6 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors"
          >
            Salvar
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const variablePricingRuleTypeOptions: readonly {
  readonly id: VariablePricingRuleKind;
  readonly icon?: HugeIconData;
  readonly iconNode?: ReactNode;
  readonly title: string;
  readonly description: string;
}[] = [
  {
    id: "ageRange",
    iconNode: <VariablePricingAgeRangeIcon />,
    title: variablePricingRuleKindLabels.ageRange,
    description: "Preços por idade do participante, como adulto, criança e idoso.",
  },
  {
    id: "specialProfile",
    iconNode: <VariablePricingSpecialProfileIcon />,
    title: variablePricingRuleKindLabels.specialProfile,
    description: "Tarifa por perfil comprovado. Você define qual perfil e as regras de cada um.",
  },
  {
    id: "accommodation",
    iconNode: <VariablePricingAccommodationIcon />,
    title: variablePricingRuleKindLabels.accommodation,
    description: "Preço por diária conforme o tipo de quarto: single, duplo, triplo, etc.",
  },
  {
    id: "dayType",
    iconNode: <VariablePricingDayTypeIcon />,
    title: variablePricingRuleKindLabels.dayType,
    description: "Preços diferentes para dias de semana, fins de semana e feriados.",
  },
  {
    id: "seatBatch",
    iconNode: <VariablePricingSeatBatchIcon />,
    title: variablePricingRuleKindLabels.seatBatch,
    description: "O preço muda conforme as vagas vendem, como lote promocional e lote 2.",
  },
  {
    id: "custom",
    icon: PencilEdit02Icon,
    title: variablePricingRuleKindLabels.custom,
    description: "Você nomeia a tarifa e define preço e vagas, sem regra pronta.",
  },
];

const variablePricingRuleTitlePlaceholders: Record<VariablePricingRuleKind, string> = {
  ageRange: "Ex.: Tarifa Adulto",
  specialProfile: "Ex.: Tarifa Estudante",
  accommodation: "Ex.: Tarifa Single Confort",
  dayType: "Ex.: Tarifa dias alternados",
  seatBatch: "Ex.: Lote promocional",
  custom: "Ex.: Cortesia do guia local",
};

const variablePricingRuleValueLabels: Record<VariablePricingRuleKind, string> = {
  ageRange: "Valor (R$)",
  specialProfile: "Valor (R$)",
  accommodation: "Valor por diária (R$)",
  dayType: "Valor (R$)",
  seatBatch: "Valor (R$)",
  custom: "Valor (R$)",
};

function VariablePricingAgeRangeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M11.667 2.91699H8.33366C5.19096 2.91699 3.61961 2.91699 2.6433 3.8933C1.66699 4.86961 1.66699 6.44096 1.66699 9.58366V10.417C1.66699 13.5597 1.66699 15.131 2.6433 16.1073C3.61961 17.0837 5.19096 17.0837 8.33365 17.0837H8.33366H11.667H11.667C14.8097 17.0837 16.381 17.0837 17.3573 16.1073C18.3337 15.131 18.3337 13.5597 18.3337 10.417V9.58366C18.3337 6.44096 18.3337 4.86961 17.3573 3.8933C16.381 2.91699 14.8097 2.91699 11.667 2.91699Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4.16699 13.3337C5.03007 11.1828 8.24712 11.0412 9.16699 13.3337"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.12467 8.12533C8.12467 8.93074 7.47176 9.58366 6.66634 9.58366C5.86093 9.58366 5.20801 8.93074 5.20801 8.12533C5.20801 7.31991 5.86093 6.66699 6.66634 6.66699C7.47176 6.66699 8.12467 7.31991 8.12467 8.12533Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M11.667 7.08301H15.8337M11.667 9.99967H15.8337M11.667 12.9163H13.7503"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VariablePricingSpecialProfileIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M10.8337 16.9191C10.1274 17.2091 9.31249 17.1161 8.6759 16.6401C6.32484 14.882 1.66699 10.8627 1.66699 7.2457C1.66699 4.85502 3.42138 2.91699 5.83366 2.91699C7.08366 2.91699 8.33366 3.33366 10.0003 5.00033C11.667 3.33366 12.917 2.91699 14.167 2.91699C16.5793 2.91699 18.3337 4.85502 18.3337 7.2457C18.3337 7.60525 18.2876 7.96877 18.2024 8.33366"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.667 14.1663C11.667 14.1663 12.5003 14.1663 13.3337 15.833C13.3337 15.833 15.9807 11.6663 18.3337 10.833"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VariablePricingAccommodationIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M18.3337 14.583L1.66699 14.583"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3337 17.5L18.3337 13.3333C18.3337 11.762 18.3337 10.9763 17.8455 10.4882C17.3573 10 16.5717 10 15.0003 10L5.00033 10C3.42898 10 2.6433 10 2.15515 10.4882C1.66699 10.9763 1.66699 11.762 1.66699 13.3333L1.66699 17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3337 10V8.84817C13.3337 8.42525 13.2574 8.28379 12.8667 8.11708C12.0529 7.76991 11.0652 7.5 10.0003 7.5C8.93545 7.5 7.94773 7.76991 7.134 8.11708C6.74327 8.28379 6.66699 8.42525 6.66699 8.84817L6.66699 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.5 10L2.5 7.5C2.5 6.32149 2.5 5.73223 2.86612 5.36612C3.23223 5 3.82149 5 5 5C5.22896 5 5.54738 5.0606 5.75235 4.9501C5.84491 4.90021 5.92791 4.77407 6.09391 4.5218C6.89101 3.31039 8.52051 2.5 10 2.5C11.4795 2.5 13.109 3.31039 13.9061 4.5218C14.0721 4.77407 14.1551 4.90021 14.2476 4.9501C14.4526 5.0606 14.771 5 15 5C16.1785 5 16.7678 5 17.1339 5.36612C17.5 5.73223 17.5 6.32149 17.5 7.5V10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function VariablePricingDayTypeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M13.3333 1.66699V5.00033M6.66667 1.66699V5.00033M10 18.3337H9.16667C6.02417 18.3337 4.4525 18.3337 3.47667 17.357C2.50083 16.3803 2.5 14.8095 2.5 11.667V10.0003C2.5 6.85783 2.5 5.28616 3.47667 4.31033C4.45333 3.33449 6.02417 3.33366 9.16667 3.33366H10.8333C13.9758 3.33366 15.5475 3.33366 16.5233 4.31033C17.41 5.19616 17.4917 6.57199 17.5 9.16699M2.5 8.33366H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9878 13.1557C12.2482 12.606 12.654 12.138 13.1613 11.8025C13.6686 11.4669 14.258 11.2765 14.8657 11.252C15.4735 11.2274 16.0763 11.3696 16.609 11.6632C17.1417 11.9567 17.584 12.3904 17.8878 12.9173M11.667 10.834V11.6673C11.667 12.4532 11.667 12.8457 11.9112 13.0898C11.9354 13.1133 11.961 13.1353 11.9878 13.1557C12.2362 13.334 12.6253 13.334 13.3337 13.334H14.167M18.0128 16.0132C17.7524 16.5628 17.3465 17.0307 16.8392 17.3662C16.3318 17.7016 15.7424 17.8919 15.1347 17.9164C14.5269 17.9408 13.9241 17.7986 13.3914 17.5049C12.8588 17.2113 12.4166 16.7776 12.1128 16.2507M18.3337 18.334V17.5007C18.3337 16.7148 18.3337 16.3223 18.0895 16.0782C18.0653 16.055 18.0397 16.0333 18.0128 16.0132C17.7645 15.834 17.3753 15.834 16.667 15.834H15.8337"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VariablePricingSeatBatchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M16.68 1.66699C15.7522 1.66699 15 3.90557 15 6.66699H16.68C17.4897 6.66699 17.8945 6.66699 18.1451 6.38745C18.3957 6.1079 18.3521 5.73977 18.2648 5.0035C18.0345 3.05985 17.4119 1.66699 16.68 1.66699Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.0003 6.71221V15.5385C15.0003 16.7982 15.0003 17.4281 14.6154 17.676C13.9863 18.0812 13.0137 17.2315 12.5246 16.9231C12.1204 16.6682 11.9184 16.5407 11.6941 16.5334C11.4518 16.5254 11.2461 16.6476 10.8094 16.9231L9.21699 17.9273C8.78745 18.1982 8.57265 18.3337 8.33366 18.3337C8.09466 18.3337 7.87987 18.1982 7.45033 17.9273L5.85793 16.9231C5.45378 16.6682 5.25171 16.5407 5.02744 16.5334C4.78509 16.5254 4.57943 16.6476 4.14272 16.9231C3.65362 17.2315 2.68105 18.0812 2.05195 17.676C1.66699 17.4281 1.66699 16.7982 1.66699 15.5385V6.71221C1.66699 4.33387 1.66699 3.1447 2.39923 2.40585C3.13146 1.66699 4.30997 1.66699 6.66699 1.66699H16.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33366 6.66634C7.41318 6.66634 6.66699 7.22599 6.66699 7.91634C6.66699 8.6067 7.41318 9.16634 8.33366 9.16634C9.25413 9.16634 10.0003 9.72599 10.0003 10.4163C10.0003 11.1067 9.25413 11.6663 8.33366 11.6663M8.33366 6.66634C9.05934 6.66634 9.67669 7.01418 9.90549 7.49967M8.33366 6.66634V5.83301M8.33366 11.6663C7.60798 11.6663 6.99063 11.3185 6.76183 10.833M8.33366 11.6663V12.4997"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const accommodationTypeOptions: readonly {
  readonly id: VariablePricingAccommodationType;
  readonly label: string;
}[] = [
  { id: "single", label: "Single" },
  { id: "double", label: "Duplo" },
  { id: "triple", label: "Triplo" },
  { id: "quadruple", label: "Quádruplo" },
];

const variablePricingDayTypeOptions: readonly {
  readonly id: VariablePricingDayType;
  readonly label: string;
}[] = [
  { id: "weekdays", label: "Segunda a sexta" },
  { id: "weekend", label: "Sábado e domingo" },
  { id: "holiday", label: "Feriado" },
  { id: "custom", label: "Personalizado" },
];

const variablePricingBatchBasisOptions: readonly {
  readonly id: VariablePricingBatchBasis;
  readonly label: string;
}[] = [
  { id: "peopleQuantity", label: "Quantidade de pessoas" },
  { id: "purchaseDate", label: "Data de compra" },
];

function VariablePricingSegmentedControl<TValue extends string>({
  label,
  value,
  options,
  onChange,
  variant = "buttons",
}: {
  readonly label: string;
  readonly value: TValue;
  readonly options: readonly { readonly id: TValue; readonly label: string }[];
  readonly onChange: (value: TValue) => void;
  readonly variant?: "buttons" | "roundedTabs" | "blueTabs";
}) {
  if (variant === "blueTabs") {
    return (
      <div className="flex flex-col items-start gap-[10px]">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#1f2937]">
          {label}
        </p>
        <div className="flex h-[41px] w-full items-start gap-1 overflow-x-auto rounded-[8px] border border-[#e9eaeb] bg-white p-1">
          {options.map((option) => {
            const active = option.id === value;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(option.id)}
                className={`flex h-full min-w-fit flex-1 items-center justify-center rounded-[6px] px-3 py-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[19.5px] whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none sm:min-w-0 ${
                  active
                    ? "bg-[#0b5ed7] font-['Helvetica_Neue:Medium',sans-serif] text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                    : "text-[#535862] hover:bg-[#f8fafc]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "roundedTabs") {
    return (
      <div className="flex flex-col items-start gap-[10px]">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[normal] text-[#1f2937]">
          {label}
        </p>
        <div className="flex h-[48px] w-full items-center rounded-full border border-[#f5f5f5] bg-[#fafafa] p-1">
          {options.map((option) => {
            const active = option.id === value;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(option.id)}
                className={`flex h-full min-w-0 flex-1 items-center justify-center rounded-full px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] whitespace-nowrap text-[#414651] transition-colors focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none ${
                  active
                    ? "bg-white font-['Helvetica_Neue:Medium',sans-serif] shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.15)]"
                    : "hover:bg-white/60"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.id === value;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={`h-9 rounded-[8px] border px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none ${
                active
                  ? "border-[#1b71fd] bg-[#eff6ff] text-[#0b5ed7]"
                  : "border-[#e9eaeb] bg-white text-[#535862] hover:bg-[#f8fafc]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VariablePricingTimeInputIcon({ className }: { readonly className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        className ?? "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#717680]"
      }
      aria-hidden="true"
    >
      <circle cx="10.0003" cy="10.0003" r="8.33333" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.66699V10.0003L11.6667 11.667"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VariablePricingIconInput({
  label,
  value,
  placeholder,
  icon,
  iconNode,
  inputClassName,
  inputMode,
  maxLength,
  disabled,
  onChange,
}: {
  readonly label: string;
  readonly value: string;
  readonly placeholder: string;
  readonly icon?: HugeIconData;
  readonly iconNode?: ReactNode;
  readonly inputClassName?: string;
  readonly inputMode?: "numeric" | "decimal";
  readonly maxLength?: number;
  readonly disabled?: boolean;
  readonly onChange: (value: string) => void;
}) {
  return (
    <RouteDayDrawerField label={label}>
      <div className="relative">
        <input
          className={`${inputClassName ?? scheduleDrawerInputClass} pr-10 disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#a4a7ae]`}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        {iconNode ??
          (icon ? (
            <HugeiconsIcon
              icon={icon}
              size={18}
              strokeWidth={1.5}
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 ${
                disabled ? "text-[#d5d7da]" : "text-[#a4a7ae]"
              }`}
            />
          ) : null)}
      </div>
    </RouteDayDrawerField>
  );
}

function VariablePricingDialogSection({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="flex h-8 items-center border-y border-[#f0f1f3] bg-[#f9fafb] px-6">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] leading-[16.5px] tracking-[0.8px] text-[#a4a7ae] uppercase">
          {title}
        </p>
      </div>
      <div className="px-6 pt-5 pb-5">{children}</div>
    </section>
  );
}

function VariablePricingLinkedRuleDialog({
  open,
  rule,
  onOpenChange,
  onSave,
}: {
  readonly open: boolean;
  readonly rule: VariablePricingLinkedRule;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (rule: VariablePricingLinkedRule) => void;
}) {
  const [draft, setDraft] = useState(rule);

  useEffect(() => {
    if (open) setDraft(rule);
  }, [open, rule]);

  const closeDialog = () => onOpenChange(false);
  const updateDraft = (update: Partial<VariablePricingLinkedRule>) => {
    setDraft((currentDraft) => ({ ...currentDraft, ...update }));
  };
  const canSave = Boolean(draft.title.trim() && onlyDigits(draft.value).length > 0);
  const saveDialog = () => {
    if (!canSave) return;

    onSave(draft);
    closeDialog();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl border border-[#e9eaeb] bg-white p-0 shadow-[0px_8px_12px_rgba(0,0,0,0.15)] sm:max-w-[725px]"
      >
        <DialogHeader className="flex flex-row items-start justify-between gap-4 border-b border-[#f0f1f3] px-6 pt-5 pb-4 text-left">
          <div className="min-w-0 flex-1">
            <DialogTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-[normal] text-[#181d27]">
              Adicionar regra vinculada
            </DialogTitle>
            <DialogDescription className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#535862]">
              Configure uma subregra para refinar a regra principal deste tarifário.
            </DialogDescription>
          </div>
          <button
            type="button"
            aria-label="Fechar regra vinculada"
            onClick={closeDialog}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#414651]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </DialogHeader>

        <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
          <VariablePricingDialogSection title="TIPO DE SUBREGRA">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {variablePricingRuleTypeOptions.map((option) => (
                <CategoryButton
                  key={option.id}
                  icon={option.icon}
                  iconNode={option.iconNode}
                  title={option.title}
                  description={option.description}
                  active={draft.kind === option.id}
                  onClick={() => updateDraft({ kind: option.id })}
                />
              ))}
            </div>
          </VariablePricingDialogSection>

          <VariablePricingDialogSection title="CONFIGURAÇÕES DE REGRA">
            <div className="flex flex-col gap-4">
              <RouteDayDrawerField label="Título da regra vinculada">
                <input
                  className={scheduleDrawerInputClass}
                  placeholder={variablePricingRuleTitlePlaceholders[draft.kind]}
                  value={draft.title}
                  onChange={(event) => updateDraft({ title: event.target.value })}
                />
              </RouteDayDrawerField>
              <RouteDayDrawerField label="Valor (R$)">
                <input
                  className={scheduleDrawerInputClass}
                  inputMode="decimal"
                  placeholder="0"
                  value={draft.value}
                  onChange={(event) =>
                    updateDraft({ value: formatCurrencyInput(event.target.value) })
                  }
                />
              </RouteDayDrawerField>
            </div>
          </VariablePricingDialogSection>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3 border-t-0 px-6 pt-1 pb-6 sm:justify-stretch">
          <button
            type="button"
            onClick={closeDialog}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveDialog}
            disabled={!canSave}
            className="h-10 rounded-[10px] bg-[#0b5ed7] px-4 font-['Helvetica_Neue:Medium',sans-serif] text-sm text-white transition-colors hover:bg-[#084fb7] disabled:cursor-not-allowed disabled:bg-[#d5d7da] disabled:text-white"
          >
            Salvar subregra
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VariablePricingRuleDrawer({
  open,
  rule,
  onOpenChange,
  onSave,
}: {
  readonly open: boolean;
  readonly rule: VariablePricingRule | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (rule: VariablePricingRule) => void;
}) {
  const [draft, setDraft] = useState<VariablePricingRule | null>(rule);
  const [linkedRuleDialogOpen, setLinkedRuleDialogOpen] = useState(false);
  const [linkedRuleDraft, setLinkedRuleDraft] = useState(createEmptyVariablePricingLinkedRule(1));
  const closeDrawer = () => onOpenChange(false);

  useEffect(() => {
    if (open) {
      setDraft(rule);
      setLinkedRuleDialogOpen(false);
    }
  }, [open, rule]);

  const updateDraft = (update: Partial<VariablePricingRule>) => {
    setDraft((currentDraft) => (currentDraft ? { ...currentDraft, ...update } : currentDraft));
  };

  const toggleCustomWeekday = (weekday: ProductPeriodWeekdayId) => {
    setDraft((currentDraft) => {
      if (!currentDraft) return currentDraft;

      const hasWeekday = currentDraft.customWeekdays.includes(weekday);
      return {
        ...currentDraft,
        customWeekdays: hasWeekday
          ? currentDraft.customWeekdays.filter((item) => item !== weekday)
          : [...currentDraft.customWeekdays, weekday],
      };
    });
  };

  const saveDrawer = () => {
    if (!draft) return;

    onSave(draft);
    closeDrawer();
  };
  const openLinkedRuleDialog = () => {
    if (!draft) return;

    const nextLinkedRuleOrder =
      Math.max(...draft.linkedRules.map((linkedRule) => linkedRule.order), 0) + 1;
    setLinkedRuleDraft(createEmptyVariablePricingLinkedRule(nextLinkedRuleOrder));
    setLinkedRuleDialogOpen(true);
  };
  const editLinkedRule = (linkedRule: VariablePricingLinkedRule) => {
    setLinkedRuleDraft(linkedRule);
    setLinkedRuleDialogOpen(true);
  };
  const removeLinkedRule = (linkedRuleId: string) => {
    setDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            linkedRules: currentDraft.linkedRules.filter(
              (linkedRule) => linkedRule.id !== linkedRuleId
            ),
          }
        : currentDraft
    );
  };
  const saveLinkedRule = (linkedRule: VariablePricingLinkedRule) => {
    setDraft((currentDraft) =>
      currentDraft
        ? {
            ...currentDraft,
            linkedRules: currentDraft.linkedRules.some(
              (currentLinkedRule) => currentLinkedRule.id === linkedRule.id
            )
              ? currentDraft.linkedRules.map((currentLinkedRule) =>
                  currentLinkedRule.id === linkedRule.id ? linkedRule : currentLinkedRule
                )
              : [...currentDraft.linkedRules, linkedRule],
          }
        : currentDraft
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="!w-full overflow-hidden rounded-l-2xl border-[#e9eaeb] bg-white p-0 shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] sm:!w-[730px] sm:!max-w-[730px]"
      >
        <SheetHeader className="flex h-[69px] shrink-0 flex-row items-center justify-between gap-4 border-b border-[#f0f1f3] px-6 py-5">
          <div>
            <SheetTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
              Configurar regras de tarifa
            </SheetTitle>
            <SheetDescription className="sr-only">
              Defina o tipo de regra, valores, vigência e subregras do tarifário.
            </SheetDescription>
          </div>
          <button
            type="button"
            aria-label="Fechar configuração de regra de tarifa"
            onClick={closeDrawer}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#414651]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-5">
          {draft ? (
            <div className="flex flex-col gap-6">
              <RouteDayDrawerSection title="REGRAS">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {variablePricingRuleTypeOptions.map((option) => (
                    <CategoryButton
                      key={option.id}
                      icon={option.icon}
                      iconNode={option.iconNode}
                      title={option.title}
                      description={option.description}
                      active={draft.kind === option.id}
                      compact
                      onClick={() => updateDraft({ kind: option.id })}
                    />
                  ))}
                </div>
              </RouteDayDrawerSection>

              <RouteDayDrawerSection title="CONFIGURAÇÕES DE REGRA">
                <div className="flex flex-col gap-4">
                  <RouteDayDrawerField label="Título da regra">
                    <input
                      className={scheduleDrawerInputClass}
                      placeholder={variablePricingRuleTitlePlaceholders[draft.kind]}
                      value={draft.title}
                      onChange={(event) => updateDraft({ title: event.target.value })}
                    />
                  </RouteDayDrawerField>
                  <RouteDayDrawerField label={variablePricingRuleValueLabels[draft.kind]}>
                    <input
                      className={scheduleDrawerInputClass}
                      inputMode="decimal"
                      placeholder="0,00"
                      value={draft.value}
                      onChange={(event) =>
                        updateDraft({ value: formatCurrencyInput(event.target.value) })
                      }
                    />
                  </RouteDayDrawerField>
                </div>

                <div
                  className={`mt-5 flex flex-col ${
                    draft.stockMode === "customStock" ? "gap-4" : "gap-3"
                  }`}
                >
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                    Estoque desta regra
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CategoryButton
                      iconNode={<ProductStockRuleIcon className="mt-0.5 shrink-0" />}
                      title="Usar o estoque do produto"
                      description="Esta regra consome as vagas gerais do produto conforme as vendas acontecem."
                      active={draft.stockMode === "productStock"}
                      compact
                      onClick={() => updateDraft({ stockMode: "productStock" })}
                    />
                    <CategoryButton
                      iconNode={<CustomRuleStockIcon className="mt-0.5 shrink-0" />}
                      title="Definir vagas para esta regra"
                      description="A regra tem uma quantidade própria, sempre limitada ao estoque do produto."
                      active={draft.stockMode === "customStock"}
                      compact
                      onClick={() => updateDraft({ stockMode: "customStock" })}
                    />
                  </div>
                  <span className="flex h-6 w-fit items-center gap-1.5 rounded-full border border-[#e9eaeb] bg-[#f5f5f5] px-2.5 py-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[18px] whitespace-nowrap text-[#535862]">
                    <ProductStockChipIcon className="shrink-0 text-[#535862]" />
                    <span>Estoque do produto:</span>
                    <span className="font-['Helvetica_Neue:Medium',sans-serif]">
                      {variablePricingProductStockLabel}
                    </span>
                  </span>
                  {draft.stockMode === "customStock" ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <RouteDayDrawerField label="Quantidade mínima de vagas">
                        <div className="relative">
                          <input
                            className={`${scheduleDrawerInputClass} pr-[150px] text-[#414651] placeholder:text-[#94a3b8] disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#a4a7ae]`}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            value={draft.customStockMinimum}
                            disabled={draft.customStockNoMinimum}
                            onChange={(event) =>
                              updateDraft({
                                customStockMinimum: onlyDigits(event.target.value),
                              })
                            }
                          />
                          <label className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center gap-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm whitespace-nowrap text-[#717680]">
                            <Checkbox
                              checked={draft.customStockNoMinimum}
                              onCheckedChange={(checked) =>
                                updateDraft({
                                  customStockNoMinimum: checked === true,
                                  customStockMinimum:
                                    checked === true ? "" : draft.customStockMinimum,
                                })
                              }
                              className="size-4 rounded-[4px] border-[rgba(0,0,0,0.10)] bg-white"
                            />
                            Sem qtde. mínima
                          </label>
                        </div>
                        <VariablePricingStockLimitHint
                          value={draft.customStockNoMinimum ? "" : draft.customStockMinimum}
                        />
                      </RouteDayDrawerField>
                      <RouteDayDrawerField label="Quantidade máxima de vagas">
                        <input
                          className={`${scheduleDrawerInputClass} text-[#414651] placeholder:text-[#94a3b8]`}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="0"
                          value={draft.customStock}
                          onChange={(event) =>
                            updateDraft({ customStock: onlyDigits(event.target.value) })
                          }
                        />
                        <VariablePricingStockLimitHint value={draft.customStock} />
                      </RouteDayDrawerField>
                    </div>
                  ) : null}
                </div>

                {draft.kind === "dayType" ? (
                  <div className="mt-4 flex flex-col gap-4">
                    <VariablePricingSegmentedControl
                      label="Tipo de dia"
                      value={draft.dayType}
                      options={variablePricingDayTypeOptions}
                      variant="blueTabs"
                      onChange={(dayType) => updateDraft({ dayType })}
                    />
                    {draft.dayType === "custom" ? (
                      <div className="flex flex-col items-start gap-3">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#1f2937]">
                          Dias personalizados para seleção
                        </p>
                        <div className="flex h-9 w-full flex-wrap items-start gap-2">
                          {productPeriodWeekdayOptions.map((weekday) => {
                            const active = draft.customWeekdays.includes(weekday.id);

                            return (
                              <button
                                key={weekday.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => toggleCustomWeekday(weekday.id)}
                                className={`flex h-9 min-w-[44px] shrink-0 items-center justify-center rounded-[8px] border px-[10px] font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[19.5px] whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none ${
                                  active
                                    ? "border-[#0b5ed7] bg-[#0b5ed7] font-['Helvetica_Neue:Medium',sans-serif] text-white"
                                    : "border-[#e9eaeb] bg-white text-[#535862] hover:bg-[#f8fafc]"
                                }`}
                              >
                                {weekday.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {draft.kind === "seatBatch" ? (
                  <div className="mt-5 flex flex-col gap-4">
                    <VariablePricingSegmentedControl
                      label="Lote definido por:"
                      value={draft.batchBasis}
                      options={variablePricingBatchBasisOptions}
                      variant="roundedTabs"
                      onChange={(batchBasis) => updateDraft({ batchBasis })}
                    />
                    {draft.batchBasis === "peopleQuantity" ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <RouteDayDrawerField label="Da pessoa (Nº)">
                            <input
                              className={inputClass}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="1"
                              value={draft.batchFromPerson}
                              onChange={(event) =>
                                updateDraft({ batchFromPerson: onlyDigits(event.target.value) })
                              }
                            />
                          </RouteDayDrawerField>
                          <RouteDayDrawerField label="Até a pessoa (Nº)">
                            <input
                              className={inputClass}
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="10"
                              value={draft.batchUntilPerson}
                              onChange={(event) =>
                                updateDraft({ batchUntilPerson: onlyDigits(event.target.value) })
                              }
                            />
                          </RouteDayDrawerField>
                        </div>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                          Se este lote esgotar, a venda avança automaticamente para o próximo lote
                          (se outro for criado). O teto de todos os lotes é o estoque do produto
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <VariablePricingIconInput
                            label="Comprando de"
                            value={draft.batchPurchaseStartDate}
                            placeholder="dd/mm/aaaa"
                            icon={Calendar03Icon}
                            inputClassName={inputClass}
                            inputMode="numeric"
                            maxLength={10}
                            onChange={(value) =>
                              updateDraft({ batchPurchaseStartDate: formatDateInput(value) })
                            }
                          />
                          <VariablePricingIconInput
                            label="Comprando até"
                            value={draft.batchPurchaseEndDate}
                            placeholder="dd/mm/aaaa"
                            icon={Calendar03Icon}
                            inputClassName={inputClass}
                            inputMode="numeric"
                            maxLength={10}
                            onChange={(value) =>
                              updateDraft({ batchPurchaseEndDate: formatDateInput(value) })
                            }
                          />
                        </div>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                          O valor vale para quem compra dentro destas datas, independente de quantas
                          vagas já saíram. Obs.: não confunda com a vigência abaixo, que se refere à
                          data em que o evento acontece.
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}

                {draft.kind === "accommodation" ? (
                  <div className="mt-5">
                    <VariablePricingSegmentedControl
                      label="Tipo de acomodação"
                      value={draft.accommodationType}
                      options={accommodationTypeOptions}
                      variant="roundedTabs"
                      onChange={(accommodationType) => updateDraft({ accommodationType })}
                    />
                  </div>
                ) : null}
              </RouteDayDrawerSection>

              <RouteDayDrawerSection title="VIGÊNCIA DA REGRA">
                <div className="flex flex-col gap-4">
                  <InfoCallout>
                    A vigência vale para a data em que o evento acontece, não para a data da compra.
                    Sem vigência definida, a regra vale sempre.
                  </InfoCallout>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <VariablePricingIconInput
                      label="Válido para eventos de"
                      value={draft.validFrom}
                      placeholder="dd/mm/aaaa"
                      icon={Calendar03Icon}
                      inputMode="numeric"
                      maxLength={10}
                      onChange={(value) => updateDraft({ validFrom: formatDateInput(value) })}
                    />
                    <VariablePricingIconInput
                      label="Horário de início"
                      value={draft.startTime}
                      placeholder="hh:mm"
                      iconNode={<VariablePricingTimeInputIcon />}
                      inputMode="numeric"
                      maxLength={5}
                      onChange={(value) => updateDraft({ startTime: formatTimeInput(value) })}
                    />
                    <VariablePricingIconInput
                      label="Até"
                      value={draft.validUntil}
                      placeholder="dd/mm/aaaa"
                      icon={Calendar03Icon}
                      inputMode="numeric"
                      maxLength={10}
                      disabled={draft.indefiniteValidity}
                      onChange={(value) => updateDraft({ validUntil: formatDateInput(value) })}
                    />
                    <VariablePricingIconInput
                      label="Horário de fim"
                      value={draft.endTime}
                      placeholder="hh:mm"
                      iconNode={
                        <VariablePricingTimeInputIcon
                          className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 ${
                            draft.indefiniteValidity ? "text-[#d5d7da]" : "text-[#717680]"
                          }`}
                        />
                      }
                      inputMode="numeric"
                      maxLength={5}
                      disabled={draft.indefiniteValidity}
                      onChange={(value) => updateDraft({ endTime: formatTimeInput(value) })}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                        Definir prazo indeterminado
                      </p>
                      <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
                        O prazo não tem data de fim definido: vale até você removê-lo ou
                        desativá-lo.
                      </p>
                    </div>
                    <Switch
                      checked={draft.indefiniteValidity}
                      onCheckedChange={(indefiniteValidity) =>
                        updateDraft(
                          indefiniteValidity
                            ? { indefiniteValidity, validUntil: "", endTime: "" }
                            : { indefiniteValidity }
                        )
                      }
                      aria-label="Definir prazo indeterminado"
                    />
                  </div>
                </div>
              </RouteDayDrawerSection>

              <RouteDayDrawerSection title="REGRAS VINCULADAS">
                <div className="flex flex-col gap-4">
                  <InfoCallout>
                    Subregras refinam esta regra e podem ser de qualquer tipo. Ex.: dentro de uma
                    tarifa de quarto duplo, uma faixa etária com valor de criança.
                  </InfoCallout>
                  {draft.linkedRules.length > 0 ? (
                    <div className="relative flex flex-col gap-3 overflow-hidden">
                      {draft.linkedRules.length > 1 ? (
                        <div className="absolute top-0 bottom-9 left-0 w-0.5 bg-[#f6f6f6]" />
                      ) : null}
                      {draft.linkedRules.map((linkedRule, index) => {
                        const linkedRuleTitle = createVariablePricingLinkedRuleTitle(
                          linkedRule,
                          index
                        );

                        return (
                          <div key={linkedRule.id} className="relative flex w-full items-center">
                            <div className="h-2 w-4 shrink-0 rounded-bl-[8px] border-b-2 border-l-2 border-[#f6f6f6]" />
                            <div className="flex min-h-16 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#f5f5f5]/40 px-4 py-3">
                              <HugeiconsIcon
                                icon={More01Icon}
                                size={20}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className="shrink-0 text-[#a4a7ae]"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#0a0a0a]">
                                  {linkedRuleTitle}
                                </p>
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#737373] md:truncate">
                                  {createVariablePricingLinkedRuleDescription(linkedRule)}
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2.5">
                                <button
                                  type="button"
                                  aria-label={`Editar ${linkedRuleTitle}`}
                                  onClick={() => editLinkedRule(linkedRule)}
                                  className="focus-visible:ring-primary/20 text-primary flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-white transition-colors hover:bg-[#f8fafc] focus-visible:ring-3"
                                >
                                  <HugeiconsIcon
                                    icon={PencilEdit02Icon}
                                    size={16}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                  />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Excluir ${linkedRuleTitle}`}
                                  onClick={() => removeLinkedRule(linkedRule.id)}
                                  className="focus-visible:ring-primary/20 text-destructive hover:bg-destructive/10 flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-white transition-colors focus-visible:ring-3"
                                >
                                  <HugeiconsIcon
                                    icon={Delete02Icon}
                                    size={16}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex min-h-[160px] w-full flex-col items-center justify-center gap-[8px] rounded-xl border border-[#e9eaeb] bg-white py-[24px] text-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M15.9998 29.3337C23.3636 29.3337 29.3332 23.3641 29.3332 16.0003C29.3332 8.63653 23.3636 2.66699 15.9998 2.66699C8.63604 2.66699 2.6665 8.63653 2.6665 16.0003C2.6665 23.3641 8.63604 29.3337 15.9998 29.3337Z"
                          stroke="#D0D5DD"
                          strokeWidth="2"
                        />
                        <path
                          d="M19.354 15.3252C18.6477 16.0344 16.9283 18.6746 15.9346 18.6625C14.9506 18.557 13.3769 15.9972 12.6824 15.3252M16.0354 9.33105V18.6552M10.6821 22.669H21.3383"
                          stroke="#D0D5DD"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex flex-col items-center gap-1">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[19.5px] text-[#717680]">
                          Nenhuma regra vinculada
                        </p>
                        <p className="w-[200px] font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[16.5px] text-[#94a3b8]">
                          As subregras aparecem aqui, dentro da regra principal.
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={openLinkedRuleDialog}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#e5e5e5] bg-white px-3 py-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0b5ed7] transition-colors hover:border-[#0b5ed7] hover:bg-[#0b5ed7]/5 focus-visible:ring-3 focus-visible:ring-[#0b5ed7]/20"
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    Adicionar regra vinculada
                  </button>
                </div>
              </RouteDayDrawerSection>
              <VariablePricingLinkedRuleDialog
                open={linkedRuleDialogOpen}
                rule={linkedRuleDraft}
                onOpenChange={setLinkedRuleDialogOpen}
                onSave={saveLinkedRule}
              />
            </div>
          ) : null}
        </div>

        <SheetFooter className="h-[73px] shrink-0 flex-row items-center justify-end gap-3 border-t border-[#e9eaeb] bg-white px-6 py-4">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveDrawer}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-6 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors"
          >
            Salvar
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function RouteDayDrawerSection({
  title,
  spaced,
  children,
}: {
  readonly title: string;
  readonly spaced?: boolean;
  readonly children: ReactNode;
}) {
  return (
    <section className={`w-full ${spaced ? "pt-6" : ""}`}>
      <div className="mx-[-24px] flex h-8 items-center border-y border-[#f0f1f3] bg-[#f9fafb] px-6">
        <p className="font-['Helvetica_Neue:Medium',sans-serif] text-[11px] leading-[16.5px] tracking-[0.8px] text-[#a4a7ae] uppercase">
          {title}
        </p>
      </div>
      <div className="pt-4">{children}</div>
    </section>
  );
}

function VariablePricingStockLimitHint({ value }: { readonly value: string }) {
  const hint = getVariablePricingStockLimitHint(value);
  if (!hint) return null;

  return (
    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#d92d20]">
      {hint}
    </p>
  );
}

function RouteDayDrawerField({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
        {label}
      </span>
      {children}
    </label>
  );
}

function RouteDayConfigDrawer({
  open,
  title,
  config,
  onOpenChange,
  onSave,
}: {
  readonly open: boolean;
  readonly title: string;
  readonly config: RouteDayConfig;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (config: RouteDayConfig) => void;
}) {
  const [draft, setDraft] = useState<RouteDayConfig>(config);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const closeDrawer = () => onOpenChange(false);
  const saveDrawer = () => {
    onSave(draft);
    closeDrawer();
  };

  useEffect(() => {
    if (open) {
      setDraft(config);
    }
  }, [config, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="!w-full !max-w-[calc(100vw-32px)] overflow-hidden rounded-l-2xl border-[#e9eaeb] bg-white p-0 shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] sm:!w-[480px] sm:!max-w-[480px]"
      >
        <SheetHeader className="flex h-[69px] shrink-0 flex-row items-center justify-between gap-4 border-b border-[#f0f1f3] px-6 py-5">
          <div>
            <SheetTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
              Configurar roteiro {title.toLowerCase()}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Configure horários, atividade e cobrança do roteiro.
            </SheetDescription>
          </div>
          <button
            type="button"
            aria-label={`Fechar configuração do roteiro ${title.toLowerCase()}`}
            onClick={closeDrawer}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#414651]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-5">
          <div className="flex flex-col">
            <RouteDayDrawerSection title="HORÁRIOS">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RouteDayDrawerField label="Início">
                  <div className="relative">
                    <input
                      className={`${inputClass} pr-10 text-[#414651]`}
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="hh:mm"
                      value={draft.startTime}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          startTime: formatTimeInput(event.target.value),
                        }))
                      }
                    />
                    <TimeInputIcon className={timeInputIconClass} />
                  </div>
                </RouteDayDrawerField>
                <RouteDayDrawerField label="Fim">
                  <div className="relative">
                    <input
                      className={`${inputClass} pr-10 text-[#414651]`}
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="hh:mm"
                      value={draft.endTime}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          endTime: formatTimeInput(event.target.value),
                        }))
                      }
                    />
                    <TimeInputIcon className={timeInputIconClass} />
                  </div>
                </RouteDayDrawerField>
              </div>
            </RouteDayDrawerSection>

            <RouteDayDrawerSection title="ATIVIDADE" spaced>
              <div className="flex flex-col gap-4">
                <RouteDayDrawerField label="Título">
                  <input
                    className={inputClass}
                    placeholder="Ex.: Trilha guiada até o mirante"
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, title: event.target.value }))
                    }
                  />
                </RouteDayDrawerField>

                <RouteDayDrawerField label="Produto">
                  <Popover open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`${inputClass} flex items-center justify-between gap-2 text-left text-[#717680]`}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {draft.product || "Selecione um ou mais produtos"}
                        </span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          size={20}
                          strokeWidth={1.5}
                          aria-hidden="true"
                          className="shrink-0 text-[#717680]"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      className="z-[60] w-[var(--radix-popover-trigger-width)] rounded-[8px] border border-[#e9eaeb] bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                    >
                      {["Carro 3", "Trilha Pico do Itacolomi"].map((productOption) => (
                        <button
                          key={productOption}
                          type="button"
                          onClick={() => {
                            setDraft((current) => ({ ...current, product: productOption }));
                            setIsProductPickerOpen(false);
                          }}
                          className="flex h-9 w-full items-center rounded-[6px] px-3 text-left font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors hover:bg-[#f8fafc]"
                        >
                          {productOption}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                    Os produtos vinculados terão vagas e estoques consumidos.
                  </p>
                </RouteDayDrawerField>

                <div className="flex flex-col gap-2.5">
                  <div className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal]">
                    <p className="text-sm text-[#414651]">Esse produto será obrigatório?</p>
                    <p className="mt-1 text-xs text-[#717680]">
                      O cliente não pode remover esta etapa da compra.
                    </p>
                  </div>
                  <div className="flex h-12 rounded-full border border-[#f5f5f5] bg-[#fafafa] p-1">
                    {(["Sim", "Não"] as const).map((option) => {
                      const isSelected = draft.required === (option === "Sim");

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({ ...current, required: option === "Sim" }))
                          }
                          className={`flex flex-1 items-center justify-center rounded-full font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors ${
                            isSelected
                              ? "bg-white text-[#414651] shadow-[inset_0_0_2px_rgba(0,0,0,0.15)]"
                              : "text-[#414651] hover:bg-white/60"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </RouteDayDrawerSection>

            <RouteDayDrawerSection title="COBRANÇA" spaced>
              <RouteDayDrawerField label="Valor por pessoa (R$)">
                <div className="relative">
                  <input
                    className={`${inputClass} pr-[154px] text-[#414651]`}
                    inputMode="decimal"
                    value={draft.price}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, price: event.target.value }))
                    }
                  />
                  <label className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center gap-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm whitespace-nowrap text-[#717680]">
                    <Checkbox
                      checked={draft.includedInPrice}
                      onCheckedChange={(checked) =>
                        setDraft((current) => ({
                          ...current,
                          includedInPrice: checked === true,
                        }))
                      }
                      className="size-4 rounded-[4px] border-[#e2e8f0] bg-white"
                    />
                    Incluso no preço
                  </label>
                </div>
              </RouteDayDrawerField>
            </RouteDayDrawerSection>
          </div>
        </div>

        <SheetFooter className="h-[73px] shrink-0 flex-row items-center justify-end gap-3 border-t border-[#e9eaeb] bg-white px-6 py-4">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveDrawer}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-6 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors"
          >
            Salvar
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ProductPeriodConfigDrawer({
  open,
  config,
  onOpenChange,
  onSave,
}: {
  readonly open: boolean;
  readonly config: ProductPeriodConfig;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (config: ProductPeriodConfig) => void;
}) {
  const [draft, setDraft] = useState<ProductPeriodConfig>(config);
  const isCustomModeSelected = draft.functionModes.includes("custom");
  const closeDrawer = () => onOpenChange(false);
  const saveDrawer = () => {
    onSave(draft);
    closeDrawer();
  };
  const toggleFunctionMode = (mode: ProductPeriodFunctionMode) => {
    setDraft((current) => {
      const isSelected = current.functionModes.includes(mode);
      const functionModes = isSelected
        ? current.functionModes.filter((currentMode) => currentMode !== mode)
        : [...current.functionModes, mode];

      return {
        ...current,
        functionModes,
        customDaySchedules:
          mode === "custom" && isSelected
            ? emptyProductPeriodDaySchedules
            : current.customDaySchedules,
      };
    });
  };
  const toggleCustomWeekday = (weekdayId: ProductPeriodWeekdayId) => {
    setDraft((current) => {
      const schedule = current.customDaySchedules[weekdayId];

      return {
        ...current,
        customDaySchedules: {
          ...current.customDaySchedules,
          [weekdayId]: {
            ...schedule,
            enabled: !schedule.enabled,
          },
        },
      };
    });
  };
  const updateCustomWeekdayTime = (
    weekdayId: ProductPeriodWeekdayId,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setDraft((current) => ({
      ...current,
      customDaySchedules: {
        ...current.customDaySchedules,
        [weekdayId]: {
          ...current.customDaySchedules[weekdayId],
          [field]: value,
        },
      },
    }));
  };
  const clearDefaultCustomWeekdayTime = (
    weekdayId: ProductPeriodWeekdayId,
    field: "startTime" | "endTime"
  ) => {
    setDraft((current) => {
      const schedule = current.customDaySchedules[weekdayId];
      if (schedule[field] !== emptyProductPeriodDaySchedule[field]) return current;

      return {
        ...current,
        customDaySchedules: {
          ...current.customDaySchedules,
          [weekdayId]: {
            ...schedule,
            [field]: "",
          },
        },
      };
    });
  };

  useEffect(() => {
    if (open) {
      setDraft(config);
    }
  }, [config, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="!w-full !max-w-[calc(100vw-32px)] overflow-hidden rounded-l-2xl border-[#e9eaeb] bg-white p-0 shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] sm:!w-[480px] sm:!max-w-[480px]"
      >
        <SheetHeader className="flex h-[69px] shrink-0 flex-row items-center justify-between gap-4 border-b border-[#f0f1f3] px-6 py-5">
          <div>
            <SheetTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
              Configurar período
            </SheetTitle>
            <SheetDescription className="sr-only">
              Configure o período e os dias de funcionamento do produto.
            </SheetDescription>
          </div>
          <button
            type="button"
            aria-label="Fechar configuração do período"
            onClick={closeDrawer}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#414651]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-scroll px-6 pb-5">
          <div className="flex flex-col">
            <RouteDayDrawerSection title="HORÁRIOS">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <RouteDayDrawerField label="Início do período">
                    <div className="relative">
                      <input
                        className={`${inputClass} pr-10 text-[#414651]`}
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[0-9/]*"
                        placeholder="dd/mm/aaaa"
                        value={draft.startDate}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            startDate: formatDateInput(event.target.value),
                          }))
                        }
                      />
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#717680]"
                      />
                    </div>
                  </RouteDayDrawerField>
                  <RouteDayDrawerField label="Fim do período">
                    <div className="relative">
                      <input
                        className={`${inputClass} pr-10 text-[#414651] disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#a4a7ae]`}
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[0-9/]*"
                        placeholder="dd/mm/aaaa"
                        value={draft.endDate}
                        disabled={draft.hasIndefiniteEndDate}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            endDate: formatDateInput(event.target.value),
                          }))
                        }
                      />
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#717680]"
                      />
                    </div>
                  </RouteDayDrawerField>
                </div>

                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1 font-['Helvetica_Neue:Regular',sans-serif] leading-[normal]">
                    <p className="text-sm text-[#181d27]">Definir prazo indeterminado</p>
                    <p className="mt-1 text-xs text-[#717680]">
                      O período não tem data de fim definido: vale até você removê-lo ou
                      desativá-lo.
                    </p>
                  </div>
                  <Switch
                    checked={draft.hasIndefiniteEndDate}
                    onCheckedChange={(checked) =>
                      setDraft((current) => ({
                        ...current,
                        hasIndefiniteEndDate: checked,
                        endDate: checked ? "" : current.endDate,
                      }))
                    }
                    aria-label="Definir prazo indeterminado"
                  />
                </div>
              </div>
            </RouteDayDrawerSection>

            <RouteDayDrawerSection title="TIPO DE FUNCIONAMENTO" spaced>
              <div className="flex flex-col gap-4">
                <div className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal]">
                  <p className="text-sm text-[#414651]">Dias em que o produto funciona</p>
                  <p className="mt-1 text-xs text-[#717680]">
                    Durante este período, o produto só fica à venda nos dias selecionados. Em
                    Personalizado, você combina os dias um a um.
                  </p>
                </div>

                <div className="grid min-h-[41px] grid-cols-2 gap-1 rounded-[8px] border border-[#e9eaeb] bg-white p-1 sm:grid-cols-4">
                  {productPeriodFunctionModeOptions.map((option) => {
                    const isSelected = draft.functionModes.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleFunctionMode(option.id)}
                        className={`flex min-h-8 items-center justify-center rounded-[6px] px-3 py-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[19.5px] transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                            : "text-[#535862] hover:bg-[#f8fafc]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {isCustomModeSelected ? (
                  <div className="flex flex-col gap-3">
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                      Selecione os dias da semana em que funciona
                    </p>
                    <div className="flex flex-col gap-3">
                      {productPeriodWeekdayOptions.map((weekday) => {
                        const schedule = draft.customDaySchedules[weekday.id];
                        const isEnabled = schedule.enabled;

                        return (
                          <div
                            key={weekday.id}
                            className="grid grid-cols-[52px_minmax(0,1fr)] items-end gap-3 sm:grid-cols-[52px_minmax(0,1fr)_minmax(0,1fr)]"
                          >
                            <button
                              type="button"
                              aria-pressed={isEnabled}
                              onClick={() => toggleCustomWeekday(weekday.id)}
                              className={`flex h-10 min-w-[44px] items-center justify-center rounded-[8px] border px-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors ${
                                isEnabled
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-[#e9eaeb] bg-white text-[#535862] hover:bg-[#f8fafc]"
                              }`}
                            >
                              {weekday.label}
                            </button>

                            <RouteDayDrawerField label="Horário de início">
                              <div className="relative">
                                <input
                                  className={`${inputClass} pr-10 text-[#414651] disabled:bg-white disabled:text-[#8c97a7]`}
                                  inputMode="numeric"
                                  maxLength={5}
                                  placeholder="00:00"
                                  value={schedule.startTime}
                                  disabled={!isEnabled}
                                  onFocus={() =>
                                    clearDefaultCustomWeekdayTime(weekday.id, "startTime")
                                  }
                                  onChange={(event) =>
                                    updateCustomWeekdayTime(
                                      weekday.id,
                                      "startTime",
                                      formatTimeInput(event.target.value)
                                    )
                                  }
                                />
                                <TimeInputIcon className={timeInputIconClass} />
                              </div>
                            </RouteDayDrawerField>

                            <RouteDayDrawerField label="Horário de fim">
                              <div className="relative">
                                <input
                                  className={`${inputClass} pr-10 text-[#414651] disabled:bg-white disabled:text-[#8c97a7]`}
                                  inputMode="numeric"
                                  maxLength={5}
                                  placeholder="00:00"
                                  value={schedule.endTime}
                                  disabled={!isEnabled}
                                  onFocus={() =>
                                    clearDefaultCustomWeekdayTime(weekday.id, "endTime")
                                  }
                                  onChange={(event) =>
                                    updateCustomWeekdayTime(
                                      weekday.id,
                                      "endTime",
                                      formatTimeInput(event.target.value)
                                    )
                                  }
                                />
                                <TimeInputIcon className={timeInputIconClass} />
                              </div>
                            </RouteDayDrawerField>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </RouteDayDrawerSection>
          </div>
        </div>

        <SheetFooter className="h-[73px] shrink-0 flex-row items-center justify-end gap-3 border-t border-[#e9eaeb] bg-white px-6 py-4">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveDrawer}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-6 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors"
          >
            Salvar
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ItemConfigDrawer({
  open,
  config,
  onOpenChange,
  onSave,
}: {
  readonly open: boolean;
  readonly config: ItemConfig;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (config: ItemConfig) => void;
}) {
  const [draft, setDraft] = useState<ItemConfig>(config);
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);
  const closeDrawer = () => onOpenChange(false);
  const saveDrawer = () => {
    onSave(draft);
    closeDrawer();
  };

  useEffect(() => {
    if (open) {
      setDraft(config);
    }
  }, [config, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="!w-full !max-w-[calc(100vw-32px)] overflow-hidden rounded-l-2xl border-[#e9eaeb] bg-white p-0 shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] sm:!w-[480px] sm:!max-w-[480px]"
      >
        <SheetHeader className="flex h-[69px] shrink-0 flex-row items-center justify-between gap-4 border-b border-[#f0f1f3] px-6 py-5">
          <div>
            <SheetTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
              Configurar item
            </SheetTitle>
            <SheetDescription className="sr-only">
              Configure o item vinculado, tipo de venda, cobrança e disponibilidade.
            </SheetDescription>
          </div>
          <button
            type="button"
            aria-label="Fechar configuração do item"
            onClick={closeDrawer}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#414651]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-5">
          <div className="flex flex-col">
            <RouteDayDrawerSection title="ITEM">
              <div className="flex flex-col gap-4">
                <RouteDayDrawerField label="Item cadastrado">
                  <Popover open={isItemPickerOpen} onOpenChange={setIsItemPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`${inputClass} flex items-center justify-between gap-2 text-left text-[#717680]`}
                      >
                        <span className="min-w-0 flex-1 truncate">
                          {draft.item || "Selecione um item"}
                        </span>
                        <HugeiconsIcon
                          icon={ArrowDown01Icon}
                          size={20}
                          strokeWidth={1.5}
                          aria-hidden="true"
                          className="shrink-0 text-[#717680]"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      className="z-[60] w-[var(--radix-popover-trigger-width)] rounded-[8px] border border-[#e9eaeb] bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                    >
                      {["Almoço p/ 4 pessoas", "Carro 3", "Kit lanche"].map((itemOption) => (
                        <button
                          key={itemOption}
                          type="button"
                          onClick={() => {
                            setDraft((current) => ({ ...current, item: itemOption }));
                            setIsItemPickerOpen(false);
                          }}
                          className="flex h-9 w-full items-center rounded-[6px] px-3 text-left font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors hover:bg-[#f8fafc]"
                        >
                          {itemOption}
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                    O item vinculado terá estoque consumido.
                  </p>
                </RouteDayDrawerField>

                <div className="flex flex-col gap-2.5">
                  <div className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal]">
                    <p className="text-sm text-[#414651]">Este é um item incluso ou opcional?</p>
                    <p className="mt-1 text-xs text-[#717680]">
                      O cliente decide se adiciona este item durante a compra.
                    </p>
                  </div>
                  <div className="flex h-12 rounded-full border border-[#f5f5f5] bg-[#fafafa] p-1">
                    {(["Incluso", "Opcional"] as const).map((option) => {
                      const isSelected = draft.included === (option === "Incluso");

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({ ...current, included: option === "Incluso" }))
                          }
                          className={`flex flex-1 items-center justify-center rounded-full font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors ${
                            isSelected
                              ? "bg-white text-[#414651] shadow-[inset_0_0_2px_rgba(0,0,0,0.15)]"
                              : "text-[#414651] hover:bg-white/60"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </RouteDayDrawerSection>

            <RouteDayDrawerSection title="COBRANÇA E DISPONIBILIDADE" spaced>
              <div className="flex flex-col gap-4">
                <RouteDayDrawerField label="Valor (R$)">
                  <div className="relative">
                    <input
                      className={`${inputClass} pr-[122px] text-[#414651] disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#a4a7ae]`}
                      placeholder="0,00"
                      inputMode="decimal"
                      value={draft.value}
                      disabled={draft.complimentary}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, value: event.target.value }))
                      }
                    />
                    <label className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center gap-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm whitespace-nowrap text-[#717680]">
                      <Checkbox
                        checked={draft.complimentary}
                        onCheckedChange={(checked) =>
                          setDraft((current) => ({
                            ...current,
                            complimentary: checked === true,
                            value: checked === true ? "R$ 0,00" : current.value,
                          }))
                        }
                        className="size-4 rounded-[4px] border-[#e2e8f0] bg-white"
                      />
                      Item cortesia
                    </label>
                  </div>
                </RouteDayDrawerField>

                <RouteDayDrawerField label="Limite por dia">
                  <div className="relative">
                    <input
                      className={`${inputClass} pr-[158px] text-[#414651] disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#a4a7ae]`}
                      placeholder="0"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={draft.dailyLimit}
                      disabled={draft.useItemStock}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          dailyLimit: onlyDigits(event.target.value),
                        }))
                      }
                    />
                    <label className="absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center gap-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm whitespace-nowrap text-[#717680]">
                      <Checkbox
                        checked={draft.useItemStock}
                        onCheckedChange={(checked) =>
                          setDraft((current) => ({
                            ...current,
                            useItemStock: checked === true,
                            dailyLimit: checked === true ? "0" : current.dailyLimit,
                          }))
                        }
                        className="size-4 rounded-[4px] border-[#e2e8f0] bg-white"
                      />
                      Usar estoque do item
                    </label>
                  </div>
                  <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                    Referente a quantidade máxima do item vendido por dia.
                  </p>
                </RouteDayDrawerField>
              </div>
            </RouteDayDrawerSection>
          </div>
        </div>

        <SheetFooter className="h-[73px] shrink-0 flex-row items-center justify-end gap-3 border-t border-[#e9eaeb] bg-white px-6 py-4">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={saveDrawer}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-6 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors"
          >
            Salvar
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ScheduleActionsMenu({
  title,
  active,
  canChangeStatus,
  canRemove,
  onActiveChange,
  onConfigure,
  onRemove,
}: {
  readonly title: string;
  readonly active: boolean;
  readonly canChangeStatus: boolean;
  readonly canRemove: boolean;
  readonly onActiveChange: (active: boolean) => void;
  readonly onConfigure: () => void;
  readonly onRemove: () => void;
}) {
  const statusLabel = active ? "Horário ativo" : "Horário inativo";
  const disabledStatusTooltip = "Configure horário e capacidade antes de ativar este horário.";
  const toggleActive = () => {
    if (!canChangeStatus) return;

    onActiveChange(!active);
  };
  const statusMenuItem = (
    <DropdownMenuItem
      aria-disabled={!canChangeStatus}
      className="h-[37px] cursor-pointer gap-2 rounded-[6px] px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0f172a] focus:bg-[#f8fafc] focus:text-[#0f172a] aria-disabled:cursor-not-allowed aria-disabled:text-[#717680]"
      onSelect={(event) => event.preventDefault()}
      onClick={toggleActive}
    >
      <ActiveScheduleIcon />
      <span className="min-w-0 flex-1">{statusLabel}</span>
      <Switch
        checked={active}
        className={
          canChangeStatus
            ? undefined
            : "data-disabled:opacity-100 data-unchecked:border-[#d5d7da] data-unchecked:bg-[#d5d7da] [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:shadow-[0_1px_3px_rgba(16,24,40,0.18)]"
        }
        disabled={!canChangeStatus}
        onCheckedChange={canChangeStatus ? onActiveChange : undefined}
        onClick={(event) => event.stopPropagation()}
        aria-label={`${statusLabel} de ${title}`}
      />
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Ações de ${title}`}
          className="focus-visible:ring-primary/20 flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-white text-[#535862] transition-colors hover:bg-[#f8fafc] focus-visible:ring-3"
        >
          <HugeiconsIcon icon={MoreVerticalIcon} size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={4}
        className="flex w-[220px] flex-col gap-1 rounded-[8px] border border-[#f5f5f5] bg-white p-[6px] text-[#0f172a] shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-0 before:hidden"
      >
        <DropdownMenuItem
          className="h-[37px] cursor-pointer gap-2 rounded-[6px] px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0f172a] focus:bg-[#f8fafc] focus:text-[#0f172a]"
          onSelect={() => onConfigure()}
        >
          <ConfigureScheduleIcon />
          Configurar horário
        </DropdownMenuItem>
        {canChangeStatus ? (
          statusMenuItem
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{statusMenuItem}</div>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                sideOffset={5}
                className="max-w-[176px] px-2 py-1 text-center text-[10px] leading-[14px]"
              >
                {disabledStatusTooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {canRemove ? (
          <>
            <DropdownMenuSeparator className="my-0 bg-[#f5f5f5]" />
            <DropdownMenuItem
              className="h-[37px] cursor-pointer gap-2 rounded-[6px] px-3 py-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#F04438] focus:bg-[#fef3f2] focus:text-[#F04438]"
              style={{ color: "#F04438" }}
              onSelect={() => onRemove()}
            >
              <RemoveScheduleIcon />
              Remover horário
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TimeSlotRow({
  title,
  config,
  status,
  deletable,
  onConfigChange,
  onRemove,
  onStatusChange,
}: {
  readonly title: string;
  readonly config: ScheduleTimeConfig;
  readonly status: ScheduleStatus;
  readonly deletable: boolean;
  readonly onConfigChange: (config: ScheduleTimeConfig) => void;
  readonly onRemove: () => void;
  readonly onStatusChange: (status: ScheduleStatus) => void;
}) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const isActive = status === "Ativo";
  const hasConfig = hasScheduleTimeConfig(config);
  const description = createScheduleDescription(config);

  return (
    <>
      <div className="flex min-h-16 items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#f5f5f5]/40 px-5 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#0a0a0a]">
              {title}
            </p>
            <ScheduleStatusBadge status={status} />
          </div>
          <p className="mt-0.5 truncate font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#737373]">
            {description}
          </p>
        </div>
        <ScheduleActionsMenu
          title={title}
          active={isActive}
          canChangeStatus={hasConfig}
          canRemove={deletable}
          onActiveChange={(nextActive) => onStatusChange(nextActive ? "Ativo" : "Inativo")}
          onConfigure={() => setIsConfigOpen(true)}
          onRemove={onRemove}
        />
      </div>
      <ScheduleConfigDrawer
        open={isConfigOpen}
        title={title}
        config={config}
        onOpenChange={setIsConfigOpen}
        onSave={onConfigChange}
      />
    </>
  );
}

function ScheduleRemovalDialog({
  open,
  title = "Remover horário?",
  onConfirm,
  onOpenChange,
}: {
  readonly open: boolean;
  readonly title?: string;
  readonly onConfirm: () => void;
  readonly onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl border border-[#e9eaeb] bg-white p-0 shadow-xl sm:max-w-[420px]"
      >
        <DialogHeader className="gap-2 px-6 pt-6 pb-5">
          <DialogTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
            {title}
          </DialogTitle>
          <DialogDescription className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#535862]">
            Esta ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t border-[#e9eaeb] px-6 py-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-[10px] bg-[#F04438] px-5 font-['Helvetica_Neue:Medium',sans-serif] text-sm text-white transition-colors hover:bg-[#d92d20]"
          >
            Excluir
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ScheduleRulesList({
  slots,
  setSlots,
  nextOrder,
  setNextOrder,
}: {
  readonly slots: readonly ScheduleTimeSlot[];
  readonly setSlots: Dispatch<SetStateAction<readonly ScheduleTimeSlot[]>>;
  readonly nextOrder: number;
  readonly setNextOrder: Dispatch<SetStateAction<number>>;
}) {
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);
  const orderedSlots = useMemo(() => orderScheduleTimeSlots(slots), [slots]);
  const hasPendingRemoval = pendingRemovalId !== null;

  const addSlot = () => {
    setSlots((currentSlots) => [...currentSlots, createEmptyScheduleTimeSlot(nextOrder)]);
    setNextOrder((currentOrder) => currentOrder + 1);
  };
  const removeSlot = (slotId: string) => {
    setSlots((currentSlots) => {
      const remainingSlots = currentSlots.filter((slot) => slot.id !== slotId);

      if (remainingSlots.length > 0) {
        return remainingSlots;
      }

      return [createEmptyScheduleTimeSlot(nextOrder)];
    });
    setNextOrder((currentOrder) => currentOrder + 1);
  };
  const requestSlotRemoval = (slot: ScheduleTimeSlot) => {
    if (hasScheduleTimeConfig(slot.config)) {
      setPendingRemovalId(slot.id);
      return;
    }

    removeSlot(slot.id);
  };
  const confirmSlotRemoval = () => {
    if (pendingRemovalId) {
      removeSlot(pendingRemovalId);
    }
    setPendingRemovalId(null);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {orderedSlots.map((slot, index) => (
          <TimeSlotRow
            key={slot.id}
            title={`Horário ${index + 1}`}
            config={slot.config}
            status={slot.status}
            deletable={orderedSlots.length > 1 || hasScheduleTimeConfig(slot.config)}
            onConfigChange={(config) =>
              setSlots((currentSlots) =>
                currentSlots.map((currentSlot) =>
                  currentSlot.id === slot.id ? { ...currentSlot, config } : currentSlot
                )
              )
            }
            onRemove={() => requestSlotRemoval(slot)}
            onStatusChange={(status) =>
              setSlots((currentSlots) =>
                currentSlots.map((currentSlot) =>
                  currentSlot.id === slot.id ? { ...currentSlot, status } : currentSlot
                )
              )
            }
          />
        ))}
        <DashedAddButton onClick={addSlot}>Adicionar horário</DashedAddButton>
      </div>
      <ScheduleRemovalDialog
        open={hasPendingRemoval}
        onConfirm={confirmSlotRemoval}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRemovalId(null);
          }
        }}
      />
    </>
  );
}

function DashedAddButton({
  children,
  onClick,
}: {
  readonly children: ReactNode;
  readonly onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[#e5e5e5] bg-white px-3 py-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0b5ed7] transition-colors hover:border-[#0b5ed7] hover:bg-[#0b5ed7]/5 focus-visible:ring-3 focus-visible:ring-[#0b5ed7]/20"
    >
      <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={1.5} aria-hidden="true" />
      {children}
    </button>
  );
}

function MapLinkField({
  value,
  onChange,
  onOpen,
}: {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onOpen: () => void;
}) {
  const inputId = "product-map-link";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={inputId}
          className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]"
        >
          Link do mapa (Google Maps)
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label="Como funciona"
                className="flex h-5 shrink-0 cursor-pointer items-center gap-1 rounded-md bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#414651] transition-colors hover:text-[#252b37] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 9.5C9.5 8.11929 10.6193 7 12 7C13.3807 7 14.5 8.11929 14.5 9.5C14.5 10.3569 14.0689 11.1131 13.4117 11.5636C12.7283 12.0319 12 12.6716 12 13.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 17.0001H12.009"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Como funciona
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              sideOffset={8}
              className="max-w-[264px] flex-col items-start gap-1.5 py-2.5 text-left font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-[15px]"
            >
              <p>
                Para exibir o mapa da localização, cole aqui o código de incorporação do Google
                Maps:
              </p>
              <ol className="list-decimal space-y-0.5 pl-4">
                <li>Abra o Google Maps e busque o endereço desejado;</li>
                <li>Clique em Compartilhar;</li>
                <li>Selecione a aba Incorporar um mapa;</li>
                <li>Clique em Copiar HTML;</li>
                <li>Cole o código copiado neste campo.</li>
              </ol>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="focus-within:border-primary focus-within:ring-primary/20 flex h-10 w-full overflow-hidden rounded-[8px] border border-[#cbd5e1] bg-white focus-within:ring-3">
        <input
          id={inputId}
          className="text-foreground min-w-0 flex-1 bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm outline-none placeholder:text-slate-400"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://maps.google.com/nomedolocal"
        />
        <button
          type="button"
          onClick={onOpen}
          className="text-primary flex h-full shrink-0 cursor-pointer items-center gap-1.5 bg-transparent px-3 font-['Helvetica_Neue:Regular',sans-serif] text-xs transition-colors hover:text-[#084fb7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
        >
          Ver no Maps
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function MeetingPointReorderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      color="currentColor"
      className="shrink-0 text-[#a4a7ae]"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        d="M6.00449 6.5V6M7.00449 6.5C7.00449 5.94772 6.55677 5.5 6.00449 5.5C5.4522 5.5 5.00449 5.94772 5.00449 6.5C5.00449 7.05228 5.4522 7.5 6.00449 7.5C6.55677 7.5 7.00449 7.05228 7.00449 6.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.00449 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M6.00449 18.5V18M7.00449 18.5C7.00449 17.9477 6.55677 17.5 6.00449 17.5C5.4522 17.5 5.00449 17.9477 5.00449 18.5C5.00449 19.0523 5.4522 19.5 6.00449 19.5C6.55677 19.5 7.00449 19.0523 7.00449 18.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M18.0045 6.5V6M19.0045 6.5C19.0045 5.94772 18.5568 5.5 18.0045 5.5C17.4522 5.5 17.0045 5.94772 17.0045 6.5C17.0045 7.05228 17.4522 7.5 18.0045 7.5C18.5568 7.5 19.0045 7.05228 19.0045 6.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M18.0045 12.5V12M19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.0045 12.5V12M13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.0045 6.5V6M13.0045 6.5C13.0045 5.94772 12.5568 5.5 12.0045 5.5C11.4522 5.5 11.0045 5.94772 11.0045 6.5C11.0045 7.05228 11.4522 7.5 12.0045 7.5C12.5568 7.5 13.0045 7.05228 13.0045 6.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M18.0045 18.5V18M19.0045 18.5C19.0045 17.9477 18.5568 17.5 18.0045 17.5C17.4522 17.5 17.0045 17.9477 17.0045 18.5C17.0045 19.0523 17.4522 19.5 18.0045 19.5C18.5568 19.5 19.0045 19.0523 19.0045 18.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M12.0045 18.5V18M13.0045 18.5C13.0045 17.9477 12.5568 17.5 12.0045 17.5C11.4522 17.5 11.0045 17.9477 11.0045 18.5C11.0045 19.0523 11.4522 19.5 12.0045 19.5C12.5568 19.5 13.0045 19.0523 13.0045 18.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MeetingPointNameField({
  label,
  value,
  onChange,
  placeholder,
  onRemove,
  removeDisabled,
}: {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly onRemove: () => void;
  readonly removeDisabled: boolean;
}) {
  return (
    <div className="flex items-end gap-3">
      <div className="flex h-10 shrink-0 items-center justify-center">
        <MeetingPointReorderIcon />
      </div>
      <div className="min-w-0 flex-1">
        <Field label={label}>
          <input
            className={inputClass}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
        </Field>
      </div>
      <button
        type="button"
        aria-label={`Excluir ${label}`}
        disabled={removeDisabled}
        onClick={onRemove}
        className="text-destructive hover:bg-destructive/10 focus-visible:ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-white transition-colors focus-visible:ring-3 disabled:cursor-not-allowed disabled:text-[#d5d7da] disabled:hover:bg-white"
      >
        <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

function ScheduleBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex max-w-full items-center gap-1.5 rounded-full bg-[#f5f5f5] py-1 pr-1 pl-2.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[18px] text-[#535862]">
      <span className="min-w-0 break-words">{label}</span>
      <span className="shrink-0 rounded-full border border-[#e9eaeb] bg-white px-2.5 py-0.5 text-[#414651]">
        {value}
      </span>
    </span>
  );
}

function AdvancedStockToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  readonly title: string;
  readonly description: string;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#181d27]">
          {title}
        </p>
        <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#717680]">
          {description}
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
    </div>
  );
}

function ReadinessSidebar({
  productName,
  summary,
  readiness,
  onActivateSection,
}: {
  productName: string;
  summary: readonly ProductSummaryRow[];
  readiness: ReadinessChecklistState;
  onActivateSection: (id: ProductStepId) => void;
}) {
  const checklist: readonly {
    readonly label: string;
    readonly done: boolean;
    readonly targetSection: ProductStepId;
  }[] = [
    { label: "Tipo e nome do produto", done: readiness.hasProductInfo, targetSection: "info" },
    {
      label: "Configurar horário",
      done: readiness.hasConfiguredSchedules,
      targetSection: "schedule",
    },
    {
      label: "Definir o valor do anúncio",
      done: readiness.hasAdvertisedPrice,
      targetSection: "pricing",
    },
    {
      label: "Escolher a política de cancelamento",
      done: readiness.hasCancellationPolicy,
      targetSection: "participant",
    },
    {
      label: "Ao menos 1 canal de venda",
      done: readiness.hasSalesChannel,
      targetSection: "settings",
    },
  ];
  const readinessProgress = Math.round(
    (checklist.filter((item) => item.done).length / checklist.length) * 100
  );
  const readinessProgressRadius = 19;
  const readinessProgressCircumference = 2 * Math.PI * readinessProgressRadius;
  const readinessProgressOffset =
    readinessProgressCircumference - (readinessProgress / 100) * readinessProgressCircumference;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 lg:sticky lg:top-6 lg:w-[326px] lg:self-start">
      <div className="flex flex-col gap-4 rounded-[15px] border border-[#e9eaeb] bg-white p-4 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <div
            className="relative flex size-12 shrink-0 items-center justify-center rounded-full"
            aria-label={`${readinessProgress}% pronto para publicar`}
            role="img"
          >
            <svg
              className="absolute inset-0 -rotate-90"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r={readinessProgressRadius}
                fill="none"
                stroke="#e9eef8"
                strokeWidth="5"
              />
              <circle
                cx="24"
                cy="24"
                r={readinessProgressRadius}
                fill="none"
                stroke="#0b5ed7"
                strokeLinecap="round"
                strokeWidth="5"
                className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500 motion-safe:ease-out motion-reduce:transition-none"
                style={{
                  strokeDasharray: readinessProgressCircumference,
                  strokeDashoffset: readinessProgressOffset,
                }}
              />
            </svg>
            <span className="relative font-['Helvetica_Neue:Medium',sans-serif] text-[11px] leading-none text-[#383d54]">
              {readinessProgress}%
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#181d27]">
              Pronto para publicar?
            </h2>
            <p className="mt-0.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#6b7280]">
              Complete os passos abaixo e seu produto entra no ar.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-[6px]">
            {checklist.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onActivateSection(item.targetSection)}
                className="-mx-1 flex items-start gap-2 rounded-[6px] px-1 py-0.5 text-left transition-colors hover:bg-[#f8fafc] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
              >
                <HugeiconsIcon
                  icon={item.done ? CheckmarkCircle02Icon : CircleIcon}
                  size={16}
                  aria-hidden="true"
                  className={
                    item.done ? "text-primary mt-px shrink-0" : "mt-px shrink-0 text-[#d5d7da]"
                  }
                />
                <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[normal] text-[#6b7280]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <div className="h-px w-full bg-[#f5f5f5]" />
          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#6b7280]">
            Você pode salvar como rascunho a qualquer momento. Para publicar, complete os itens
            acima.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e9eaeb] bg-white px-4 py-4 shadow-sm">
        <h2 className="font-['Helvetica_Neue:Regular',sans-serif] text-base text-[#181d27]">
          Resumo
        </h2>
        <dl className="mt-3 flex flex-col gap-2.5">
          {summary.map((item) => (
            <div key={item.label} className="grid grid-cols-2 gap-4">
              <dt className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[15px] text-[#717680]">
                {item.label}
              </dt>
              <dd className="truncate text-right font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[15px] text-[#252b37]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="sr-only">{productName || "Produto sem nome"}</p>
      </div>
    </aside>
  );
}

function ProductHistoryDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const closeDrawer = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full overflow-hidden rounded-l-2xl border-[#e9eaeb] bg-white p-0 shadow-[-8px_0px_24px_0px_rgba(0,0,0,0.1)] sm:max-w-[720px]"
      >
        <SheetHeader className="flex h-[69px] shrink-0 flex-row items-center justify-between gap-4 border-b border-[#f0f1f3] px-6 py-5">
          <div>
            <SheetTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
              Histórico de ações
            </SheetTitle>
            <SheetDescription className="sr-only">
              Lista cronológica das ações registradas neste produto.
            </SheetDescription>
          </div>
          <button
            type="button"
            aria-label="Fechar histórico de ações"
            onClick={closeDrawer}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#f8fafc] hover:text-[#414651]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <ol className="flex flex-col">
            {productHistoryEvents.map((event, index) => {
              const isLast = index === productHistoryEvents.length - 1;
              const spacingClass = index === 0 ? "" : "pt-4";
              const lineTopClass = index === 0 ? "after:top-[19px]" : "after:top-[35px]";

              return (
                <li
                  key={`${event.title}-${event.occurredAt}`}
                  className={`relative flex gap-3 ${spacingClass} ${
                    isLast
                      ? ""
                      : `after:absolute after:left-[5px] ${lineTopClass} after:h-[29px] after:w-px after:bg-[#e9eaeb]`
                  }`}
                >
                  <div
                    className={`flex w-[11px] shrink-0 justify-center ${index === 0 ? "pt-0.5" : "pt-[18px]"}`}
                  >
                    <span
                      className={`size-[11px] rounded-full ${
                        event.highlighted ? "bg-[#1570ef]" : "bg-[#a4a7ae]"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <p className="min-w-0 flex-1 font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-4 text-[#414651]">
                        {event.title}
                      </p>
                      <time className="shrink-0 font-['Helvetica_Neue:Regular',sans-serif] text-[11px] leading-4 whitespace-nowrap text-[#9ca3af]">
                        {event.occurredAt}
                      </time>
                    </div>
                    <div className="mt-1 flex items-start gap-1.5 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4">
                      <span className="shrink-0 text-[#9ca3af]">Responsável:</span>
                      {event.responsibleLink ? (
                        <button
                          type="button"
                          className="flex min-w-0 items-center gap-1 rounded-[6px] text-[#414651] transition-colors hover:text-[#252b37]"
                        >
                          <span className="truncate">{event.responsible}</span>
                          <HugeiconsIcon
                            icon={ArrowUpRight01Icon}
                            size={16}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <span className="min-w-0 truncate text-[#9ca3af]">{event.responsible}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <SheetFooter className="h-[73px] shrink-0 items-end border-t border-[#e9eaeb] bg-white px-6 py-[17px]">
          <button
            type="button"
            onClick={closeDrawer}
            className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-7 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#252b37] transition-colors hover:bg-[#f8fafc]"
          >
            Fechar aba
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function NewProductFlow({
  mode,
  form,
  formError,
  onClose,
  onSave,
  updateForm,
}: NewProductFlowProps) {
  const [restoredFlowDraft] = useState(() => (mode === "new" ? readNewProductFlowDraft() : null));
  const [activeSection, setActiveSection] = useState<ProductStepId>("info");
  const [productContractMode, setProductContractMode] = useState<ProductContractMode>(
    restoredFlowDraft?.productContractMode ?? "onDemand"
  );
  const [productOperatingMode, setProductOperatingMode] = useState<ProductOperatingMode>(
    restoredFlowDraft?.productOperatingMode ?? "everyDay"
  );
  const [productPeriodConfigs, setProductPeriodConfigs] = useState<readonly ProductPeriodConfig[]>(
    restoredFlowDraft?.productPeriodConfigs ?? initialProductPeriodConfigs
  );
  const [shortDescription, setShortDescription] = useState(
    restoredFlowDraft?.shortDescription ?? form.descricao
  );
  const [mapLink, setMapLink] = useState(restoredFlowDraft?.mapLink ?? "");
  const [isMeetingPointsEnabled, setIsMeetingPointsEnabled] = useState(
    restoredFlowDraft?.isMeetingPointsEnabled ?? true
  );
  const [additionalMeetingPointConfigs, setAdditionalMeetingPointConfigs] = useState<
    readonly MeetingPointConfig[]
  >(restoredFlowDraft?.additionalMeetingPointConfigs ?? initialAdditionalMeetingPointConfigs);
  const [communicationChannels, setCommunicationChannels] = useState<Set<CommunicationChannel>>(
    () => new Set(restoredFlowDraft?.communicationChannels ?? defaultCommunicationChannels)
  );
  const [emailTemplate, setEmailTemplate] = useState(defaultEmailTemplate);
  const [whatsappTemplate, setWhatsappTemplate] = useState(defaultWhatsappTemplate);
  const [salesChannels, setSalesChannels] = useState<Set<SalesChannel>>(
    () => new Set(restoredFlowDraft?.salesChannels ?? defaultSalesChannels)
  );
  const [preEventReminderHours] = useState(restoredFlowDraft?.preEventReminderHours ?? "24");
  const [sameDayReminderHours] = useState(restoredFlowDraft?.sameDayReminderHours ?? "0");
  const [minimumParticipants, setMinimumParticipants] = useState(
    restoredFlowDraft?.minimumParticipants ?? ""
  );
  const [maximumParticipants, setMaximumParticipants] = useState(
    restoredFlowDraft?.maximumParticipants ?? ""
  );
  const [durationDays, setDurationDays] = useState(restoredFlowDraft?.durationDays ?? "");
  const [isAgeLimitEnabled, setIsAgeLimitEnabled] = useState(
    restoredFlowDraft?.isAgeLimitEnabled ?? false
  );
  const [minimumAge, setMinimumAge] = useState(restoredFlowDraft?.minimumAge ?? "");
  const [maximumAge, setMaximumAge] = useState(restoredFlowDraft?.maximumAge ?? "");
  const [productEffortLevel, setProductEffortLevel] = useState<ProductEffortLevel>(
    restoredFlowDraft?.productEffortLevel ?? "unclassified"
  );
  const [isParticipantDataSheetEnabled, setIsParticipantDataSheetEnabled] = useState(
    restoredFlowDraft?.isParticipantDataSheetEnabled ?? true
  );
  const [participantDataFormMode, setParticipantDataFormMode] = useState<ParticipantDataFormMode>(
    restoredFlowDraft?.participantDataFormMode ?? defaultParticipantDataFormMode
  );
  const [participantDataFields, setParticipantDataFields] = useState<Set<ParticipantDataField>>(
    () => new Set(restoredFlowDraft?.participantDataFields ?? defaultParticipantDataFields)
  );
  const [productChargeMode, setProductChargeMode] = useState<ProductChargeMode>(
    restoredFlowDraft?.productChargeMode ?? defaultProductChargeMode
  );
  const [hasConfiguredVariableTariff, setHasConfiguredVariableTariff] = useState(
    restoredFlowDraft?.hasConfiguredVariableTariff ?? false
  );
  const [variablePricingRules, setVariablePricingRules] = useState<readonly VariablePricingRule[]>(
    restoredFlowDraft?.variablePricingRules ?? initialVariablePricingRules
  );
  const [nextVariablePricingRuleOrder, setNextVariablePricingRuleOrder] = useState(
    restoredFlowDraft?.nextVariablePricingRuleOrder ?? 2
  );
  const [productBillingBase, setProductBillingBase] = useState<ProductBillingBase>(
    restoredFlowDraft?.productBillingBase ?? defaultProductBillingBase
  );
  const [closedGroupPrice, setClosedGroupPrice] = useState(
    restoredFlowDraft?.closedGroupPrice ?? defaultClosedGroupPrice
  );
  const [isDepositEnabled, setIsDepositEnabled] = useState(
    restoredFlowDraft?.isDepositEnabled ?? defaultIsDepositEnabled
  );
  const [depositChargeMode, setDepositChargeMode] = useState<ProductDepositChargeMode>(
    restoredFlowDraft?.depositChargeMode ?? defaultDepositChargeMode
  );
  const [depositPercentage, setDepositPercentage] = useState(
    restoredFlowDraft?.depositPercentage ?? defaultDepositPercentage
  );
  const [depositFixedValue, setDepositFixedValue] = useState(
    restoredFlowDraft?.depositFixedValue ?? defaultDepositFixedValue
  );
  const [depositDueDate, setDepositDueDate] = useState(
    restoredFlowDraft?.depositDueDate ?? defaultDepositDueDate
  );
  const [onlineSurchargePercent, setOnlineSurchargePercent] = useState(
    restoredFlowDraft?.onlineSurchargePercent ?? defaultOnlineSurchargePercent
  );
  const [reservationConfirmationMode, setReservationConfirmationMode] =
    useState<ReservationConfirmationMode>(
      restoredFlowDraft?.reservationConfirmationMode ?? defaultReservationConfirmationMode
    );
  const [cartHoldTimeMinutes, setCartHoldTimeMinutes] = useState<CartHoldTimeMinutes>(
    restoredFlowDraft?.cartHoldTimeMinutes ?? defaultCartHoldTimeMinutes
  );
  const [paymentProxy, setPaymentProxy] = useState<PaymentProxyOption | "">(
    restoredFlowDraft?.paymentProxy ?? defaultPaymentProxy
  );
  const [installmentCount, setInstallmentCount] = useState<PaymentInstallmentCount | "">(
    restoredFlowDraft?.installmentCount ?? defaultInstallmentCount
  );
  const [paymentMethods, setPaymentMethods] = useState<Set<PaymentMethodId>>(
    () => new Set(restoredFlowDraft?.paymentMethods ?? defaultPaymentMethods)
  );
  const [creditCardSurchargePercent, setCreditCardSurchargePercent] = useState(
    restoredFlowDraft?.creditCardSurchargePercent ?? defaultCreditCardSurchargePercent
  );
  const [pixDiscountPercent, setPixDiscountPercent] = useState(
    restoredFlowDraft?.pixDiscountPercent ?? defaultPixDiscountPercent
  );
  const [isPromotionalPriceEnabled, setIsPromotionalPriceEnabled] = useState(
    restoredFlowDraft?.isPromotionalPriceEnabled ?? true
  );
  const [promotionalPrice, setPromotionalPrice] = useState(
    restoredFlowDraft?.promotionalPrice ?? defaultPromotionalPrice
  );
  const [promotionStartDate, setPromotionStartDate] = useState(
    restoredFlowDraft?.promotionStartDate ?? ""
  );
  const [promotionEndDate, setPromotionEndDate] = useState(
    restoredFlowDraft?.promotionEndDate ?? ""
  );
  const [responsibilityTermTitle, setResponsibilityTermTitle] = useState(
    restoredFlowDraft?.responsibilityTermTitle ?? defaultResponsibilityTermTitle
  );
  const [responsibilityTermText, setResponsibilityTermText] = useState(
    restoredFlowDraft?.responsibilityTermText ?? defaultResponsibilityTermText
  );
  const [advancedStockSku, setAdvancedStockSku] = useState(
    restoredFlowDraft?.advancedStockSku ?? "SAM-CEL-S24-CZ-256"
  );
  const [advancedStockBarcode, setAdvancedStockBarcode] = useState(
    restoredFlowDraft?.advancedStockBarcode ?? "7622300847791"
  );
  const [advancedStockToggles, setAdvancedStockToggles] = useState<
    Record<AdvancedStockToggleId, boolean>
  >(restoredFlowDraft?.advancedStockToggles ?? defaultAdvancedStockToggles);
  const [routeDayConfigs, setRouteDayConfigs] = useState<readonly RouteDayConfig[]>(
    restoredFlowDraft?.routeDayConfigs ?? initialRouteDayConfigs
  );
  const [itemConfigs, setItemConfigs] = useState<readonly ItemConfig[]>(
    restoredFlowDraft?.itemConfigs ?? initialItemConfigs
  );
  const [voucherInstructions, setVoucherInstructions] = useState(
    restoredFlowDraft?.voucherInstructions ?? defaultWhatsappTemplateBody
  );
  const [preEventMessage, setPreEventMessage] = useState(
    restoredFlowDraft?.preEventMessage ?? defaultEmailTemplateBody
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeProductPeriodConfigIndex, setActiveProductPeriodConfigIndex] = useState<
    number | null
  >(null);
  const [activeVariablePricingRuleIndex, setActiveVariablePricingRuleIndex] = useState<
    number | null
  >(null);
  const [pendingProductPeriodRemovalIndex, setPendingProductPeriodRemovalIndex] = useState<
    number | null
  >(null);
  const [pendingVariablePricingRuleRemovalIndex, setPendingVariablePricingRuleRemovalIndex] =
    useState<number | null>(null);
  const [activeRouteDayConfigIndex, setActiveRouteDayConfigIndex] = useState<number | null>(null);
  const [pendingRouteDayRemovalIndex, setPendingRouteDayRemovalIndex] = useState<number | null>(
    null
  );
  const productFlowMainRef = useRef<HTMLElement | null>(null);
  const productItemsSectionRef = useRef<HTMLDivElement | null>(null);
  const productItemsHighlightTimeoutRef = useRef<number | null>(null);
  const [isProductItemsHighlighted, setIsProductItemsHighlighted] = useState(false);
  const [routeDayDragState, setRouteDayDragState] = useState<RouteDayDragState | null>(null);
  const routeDayDragStateRef = useRef<RouteDayDragState | null>(null);
  const [activeItemConfigIndex, setActiveItemConfigIndex] = useState<number | null>(null);
  const [pendingItemRemovalIndex, setPendingItemRemovalIndex] = useState<number | null>(null);
  const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false);
  const [isAdvancedStockOpen, setIsAdvancedStockOpen] = useState(
    restoredFlowDraft?.isAdvancedStockOpen ?? false
  );
  const [isProductItemsEnabled, setIsProductItemsEnabled] = useState(
    restoredFlowDraft?.isProductItemsEnabled ?? true
  );
  const [isProductCollaboratorsEnabled, setIsProductCollaboratorsEnabled] = useState(
    restoredFlowDraft?.isProductCollaboratorsEnabled ?? true
  );
  const [isTransportIncluded, setIsTransportIncluded] = useState(
    restoredFlowDraft?.isTransportIncluded ?? true
  );
  const restoredGeneratedProductUrlSlug = createProductUrlSlug(form.nome);
  const restoredProductUrlSlug = restoredFlowDraft?.productUrlSlug ?? "";
  const isRestoredProductUrlSlugManuallyEdited =
    restoredProductUrlSlug.trim() !== "" &&
    restoredProductUrlSlug !== defaultProductUrlSlug &&
    restoredProductUrlSlug !== restoredGeneratedProductUrlSlug;
  const [productUrlSlug, setProductUrlSlug] = useState(
    isRestoredProductUrlSlugManuallyEdited
      ? restoredProductUrlSlug
      : restoredGeneratedProductUrlSlug
  );
  const [isProductUrlSlugManuallyEdited, setIsProductUrlSlugManuallyEdited] = useState(
    isRestoredProductUrlSlugManuallyEdited
  );
  const [isProductPublicUrlCopied, setIsProductPublicUrlCopied] = useState(false);
  const productPublicUrlCopiedTimeoutRef = useRef<number | null>(null);
  const [selectedSuggestedProductNames, setSelectedSuggestedProductNames] = useState<
    readonly string[]
  >(restoredFlowDraft?.suggestedProductNames ?? defaultSuggestedProductNames);
  const [isSuggestedProductsOpen, setIsSuggestedProductsOpen] = useState(false);
  const [isStorefrontFeatured, setIsStorefrontFeatured] = useState(
    restoredFlowDraft?.isStorefrontFeatured ?? true
  );
  const [seoPageTitle, setSeoPageTitle] = useState(restoredFlowDraft?.seoPageTitle ?? "");
  const [seoMetaDescription, setSeoMetaDescription] = useState(
    restoredFlowDraft?.seoMetaDescription ?? ""
  );
  const [isCustomJavascriptEnabled, setIsCustomJavascriptEnabled] = useState(
    restoredFlowDraft?.isCustomJavascriptEnabled ?? true
  );
  const [customJavascript, setCustomJavascript] = useState(
    restoredFlowDraft?.customJavascript ?? ""
  );

  useEffect(() => {
    if (isProductUrlSlugManuallyEdited) return;

    setProductUrlSlug(createProductUrlSlug(form.nome));
  }, [form.nome, isProductUrlSlugManuallyEdited]);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    restoredFlowDraft?.selectedCountryCode ?? DEFAULT_COUNTRY_CODE
  );
  const [selectedStateCode, setSelectedStateCode] = useState<string | undefined>(
    restoredFlowDraft?.selectedStateCode ?? undefined
  );
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>(
    restoredFlowDraft?.selectedCityId ?? undefined
  );
  const [brazilStates, setBrazilStates] =
    useState<readonly BrazilStateOption[]>(fallbackBrazilStates);
  const [brazilCities, setBrazilCities] =
    useState<readonly BrazilCityOption[]>(fallbackBrazilCities);
  const [scheduleSlots, setScheduleSlots] = useState<readonly ScheduleTimeSlot[]>(
    restoredFlowDraft?.scheduleSlots ?? initialScheduleTimeSlots
  );
  const [nextScheduleSlotOrder, setNextScheduleSlotOrder] = useState(
    restoredFlowDraft?.nextScheduleSlotOrder ?? 2
  );

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadBrazilLocationOptions(): Promise<void> {
      try {
        const [states, cities] = await Promise.all([
          fetchBrazilStates(controller.signal),
          fetchBrazilCities(controller.signal),
        ]);

        if (!isMounted) return;

        setBrazilStates(states);
        setBrazilCities(cities);
      } catch (error) {
        if (isAbortError(error)) return;

        if (error instanceof LocationOptionsError || error instanceof TypeError) {
          if (!isMounted) return;

          setBrazilStates(fallbackBrazilStates);
          setBrazilCities(fallbackBrazilCities);
          return;
        }

        throw error;
      }
    }

    void loadBrazilLocationOptions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (productItemsHighlightTimeoutRef.current !== null) {
        window.clearTimeout(productItemsHighlightTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mode !== "new") return;

    writeNewProductFlowDraft({
      version: 1,
      productContractMode,
      productOperatingMode,
      productPeriodConfigs,
      shortDescription,
      mapLink,
      isMeetingPointsEnabled,
      additionalMeetingPointConfigs,
      communicationChannels: Array.from(communicationChannels),
      salesChannels: Array.from(salesChannels),
      preEventReminderHours,
      sameDayReminderHours,
      minimumParticipants,
      maximumParticipants,
      durationDays,
      isAgeLimitEnabled,
      minimumAge,
      maximumAge,
      productEffortLevel,
      isParticipantDataSheetEnabled,
      participantDataFormMode,
      participantDataFields: Array.from(participantDataFields),
      productChargeMode,
      hasConfiguredVariableTariff,
      variablePricingRules,
      nextVariablePricingRuleOrder,
      productBillingBase,
      closedGroupPrice,
      isDepositEnabled,
      depositChargeMode,
      depositPercentage,
      depositFixedValue,
      depositDueDate,
      onlineSurchargePercent,
      reservationConfirmationMode,
      cartHoldTimeMinutes,
      paymentProxy,
      installmentCount,
      paymentMethods: Array.from(paymentMethods),
      creditCardSurchargePercent,
      pixDiscountPercent,
      isPromotionalPriceEnabled,
      promotionalPrice,
      promotionStartDate,
      promotionEndDate,
      responsibilityTermTitle,
      responsibilityTermText,
      advancedStockSku,
      advancedStockBarcode,
      advancedStockToggles,
      routeDayConfig: routeDayConfigs[0] ?? initialRouteDayConfig,
      routeDayConfigs,
      itemConfig: itemConfigs[0] ?? initialItemConfig,
      itemConfigs,
      voucherInstructions,
      preEventMessage,
      isAdvancedStockOpen,
      isProductItemsEnabled,
      isProductCollaboratorsEnabled,
      isTransportIncluded,
      productUrlSlug,
      suggestedProductNames: selectedSuggestedProductNames,
      isStorefrontFeatured,
      seoPageTitle,
      seoMetaDescription,
      isCustomJavascriptEnabled,
      customJavascript,
      selectedCountryCode,
      selectedStateCode: selectedStateCode ?? null,
      selectedCityId: selectedCityId ?? null,
      scheduleSlots,
      nextScheduleSlotOrder,
    });
  }, [
    advancedStockBarcode,
    advancedStockSku,
    advancedStockToggles,
    additionalMeetingPointConfigs,
    cartHoldTimeMinutes,
    closedGroupPrice,
    communicationChannels,
    creditCardSurchargePercent,
    customJavascript,
    depositChargeMode,
    depositDueDate,
    depositFixedValue,
    depositPercentage,
    durationDays,
    hasConfiguredVariableTariff,
    installmentCount,
    isAgeLimitEnabled,
    isAdvancedStockOpen,
    isCustomJavascriptEnabled,
    isDepositEnabled,
    isMeetingPointsEnabled,
    isParticipantDataSheetEnabled,
    participantDataFormMode,
    isPromotionalPriceEnabled,
    isProductCollaboratorsEnabled,
    itemConfigs,
    isProductItemsEnabled,
    isStorefrontFeatured,
    isTransportIncluded,
    mapLink,
    maximumAge,
    maximumParticipants,
    minimumAge,
    minimumParticipants,
    mode,
    nextScheduleSlotOrder,
    nextVariablePricingRuleOrder,
    onlineSurchargePercent,
    participantDataFields,
    preEventMessage,
    preEventReminderHours,
    paymentProxy,
    paymentMethods,
    pixDiscountPercent,
    productChargeMode,
    productEffortLevel,
    productBillingBase,
    productUrlSlug,
    reservationConfirmationMode,
    responsibilityTermText,
    responsibilityTermTitle,
    promotionalPrice,
    promotionEndDate,
    promotionStartDate,
    productContractMode,
    productOperatingMode,
    productPeriodConfigs,
    routeDayConfigs,
    sameDayReminderHours,
    salesChannels,
    scheduleSlots,
    selectedCityId,
    selectedCountryCode,
    selectedStateCode,
    selectedSuggestedProductNames,
    seoMetaDescription,
    seoPageTitle,
    shortDescription,
    variablePricingRules,
    voucherInstructions,
  ]);

  const activateStep = (id: ProductStepId) => {
    setActiveSection(id);

    const scrollContainer = productFlowMainRef.current;
    const section = document.getElementById(`produto-${id}`);
    if (!scrollContainer || !section) return;

    const activeAnchorOffset = 24;
    const containerTop = scrollContainer.getBoundingClientRect().top;
    const nextScrollTop = Math.max(
      0,
      scrollContainer.scrollTop +
        section.getBoundingClientRect().top -
        containerTop -
        activeAnchorOffset
    );

    if (typeof scrollContainer.scrollTo === "function") {
      scrollContainer.scrollTo({ top: nextScrollTop, behavior: "smooth" });
      return;
    }

    scrollContainer.scrollTop = nextScrollTop;
  };
  const updateActiveSectionFromScroll = useCallback(() => {
    const scrollContainer = productFlowMainRef.current;
    if (!scrollContainer) return;

    const containerTop = scrollContainer.getBoundingClientRect().top;
    const activeAnchorOffset = 24;
    let closestStepId: ProductStepId | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const step of steps) {
      const section = document.getElementById(`produto-${step.id}`);
      if (!section) continue;

      const distance = Math.abs(
        section.getBoundingClientRect().top - containerTop - activeAnchorOffset
      );
      if (distance >= closestDistance) continue;

      closestStepId = step.id;
      closestDistance = distance;
    }

    if (!closestStepId) return;

    setActiveSection((currentSection) =>
      currentSection === closestStepId ? currentSection : closestStepId
    );
  }, []);
  const activateProductItems = () => {
    setActiveSection("schedule");
    setIsProductItemsEnabled(true);
    setIsProductItemsHighlighted(true);

    if (productItemsHighlightTimeoutRef.current !== null) {
      window.clearTimeout(productItemsHighlightTimeoutRef.current);
    }

    productItemsHighlightTimeoutRef.current = window.setTimeout(() => {
      setIsProductItemsHighlighted(false);
      productItemsHighlightTimeoutRef.current = null;
    }, 1600);

    window.requestAnimationFrame(() => {
      const productItemsSection = productItemsSectionRef.current;

      productItemsSection?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };
  const updateCommunicationChannel = useCallback(
    (channel: CommunicationChannel, checked: boolean) => {
      setCommunicationChannels((current) => {
        const next = new Set(current);
        if (checked) next.add(channel);
        else next.delete(channel);
        return next;
      });
    },
    []
  );
  const togglePaymentMethod = useCallback((method: PaymentMethodId) => {
    setPaymentMethods((current) => {
      const next = new Set(current);
      if (next.has(method)) next.delete(method);
      else next.add(method);
      return next;
    });
  }, []);
  const salesChannelsLabel = Array.from(salesChannels).join(", ") || "Nenhum canal ativo";
  const productSummary = useMemo<readonly ProductSummaryRow[]>(
    () => [
      { label: "Categoria", value: form.tipo.trim() || "Não preenchida" },
      {
        label: "A partir de",
        value:
          productBillingBase === "closedGroup"
            ? closedGroupPrice.trim()
              ? `R$ ${closedGroupPrice.trim()} / grupo`
              : "Não preenchido"
            : form.preco.trim()
              ? `R$ ${form.preco.trim()} / pessoa`
              : "Não preenchido",
      },
      {
        label: "Programação",
        value: createProgramSummary(productContractMode, productOperatingMode),
      },
      { label: "Saídas", value: createDeparturesSummary(scheduleSlots) },
      { label: "Capacidade", value: createCapacitySummary(maximumParticipants, scheduleSlots) },
      { label: "Canais", value: salesChannelsLabel },
    ],
    [
      closedGroupPrice,
      form.preco,
      form.tipo,
      maximumParticipants,
      productBillingBase,
      productContractMode,
      productOperatingMode,
      salesChannelsLabel,
      scheduleSlots,
    ]
  );
  const readiness = useMemo<ReadinessChecklistState>(
    () => ({
      hasProductInfo: Boolean(form.nome.trim() && form.tipo.trim()),
      hasSalesChannel: salesChannels.size > 0,
      hasConfiguredSchedules:
        scheduleSlots.length > 0 &&
        scheduleSlots.every((slot) => hasCompleteScheduleTimeConfig(slot.config)),
      hasAdvertisedPrice: Boolean(
        (productBillingBase === "closedGroup" ? closedGroupPrice : form.preco).trim()
      ),
      hasCancellationPolicy: false,
    }),
    [
      closedGroupPrice,
      form.nome,
      form.preco,
      form.tipo,
      productBillingBase,
      salesChannels,
      scheduleSlots,
    ]
  );
  const paymentPreviewProductAmount =
    parseDecimalInput(productBillingBase === "closedGroup" ? closedGroupPrice : form.preco) || 150;
  const depositAmount =
    depositChargeMode === "fixedValue"
      ? parseDecimalInput(depositFixedValue)
      : (paymentPreviewProductAmount * parseDecimalInput(depositPercentage)) / 100;
  const clampedDepositAmount = Math.min(depositAmount, paymentPreviewProductAmount);
  const remainingPaymentAmount = Math.max(paymentPreviewProductAmount - clampedDepositAmount, 0);
  const onlineSurchargeAmount =
    (paymentPreviewProductAmount * parseDecimalInput(onlineSurchargePercent)) / 100;
  const paymentPreviewTotalAmount = paymentPreviewProductAmount + onlineSurchargeAmount;
  const advertisedPromotionPreviewValue = createPromotionPreviewValue(form.preco);
  const discountedPromotionPreviewValue = createPromotionPreviewValue(promotionalPrice);
  const advancedStockBadges = useMemo(
    () => [
      { label: "SKU", value: advancedStockSku.trim() || "Não preenchida" },
      { label: "Código de barras", value: advancedStockBarcode.trim() || "Não preenchida" },
      ...advancedStockToggleOptions.map((option) => ({
        label: option.summaryLabel,
        value: advancedStockToggles[option.id] ? "Habilitado" : "Desabilitado",
      })),
    ],
    [advancedStockBarcode, advancedStockSku, advancedStockToggles]
  );
  const productPeriodDescriptions = useMemo(
    () => productPeriodConfigs.map((config) => createProductPeriodDescription(config)),
    [productPeriodConfigs]
  );
  const variablePricingRuleDescriptions = useMemo(
    () => variablePricingRules.map((rule) => createVariablePricingRuleDescription(rule)),
    [variablePricingRules]
  );
  const routeDayDescriptions = useMemo(
    () => routeDayConfigs.map((config) => createRouteDayDescription(config)),
    [routeDayConfigs]
  );
  const itemDescriptions = useMemo(
    () => itemConfigs.map((config) => createItemDescription(config)),
    [itemConfigs]
  );
  const productPublicUrlPrefix = "https://retrilhar.com.br/product/";
  const productPublicUrlSlug = productUrlSlug.trim() || defaultProductUrlSlug;
  const productPublicUrl = `${productPublicUrlPrefix}${productPublicUrlSlug}`;
  const suggestedProductsSelectionLabel =
    selectedSuggestedProductNames.length === 0
      ? "Nenhum selecionado"
      : `${selectedSuggestedProductNames.length} selecionado(s)`;
  const toggleSuggestedProduct = (productName: string) => {
    setSelectedSuggestedProductNames((currentNames) => {
      if (currentNames.includes(productName)) {
        return currentNames.filter((name) => name !== productName);
      }

      return suggestedProductOptions.flatMap((option) =>
        option.name === productName || currentNames.includes(option.name) ? [option.name] : []
      );
    });
  };
  const removeSuggestedProduct = (productName: string) => {
    setSelectedSuggestedProductNames((currentNames) =>
      currentNames.filter((name) => name !== productName)
    );
  };
  const activeProductPeriodConfig =
    activeProductPeriodConfigIndex === null
      ? null
      : (productPeriodConfigs[activeProductPeriodConfigIndex] ?? null);
  const activeVariablePricingRule =
    activeVariablePricingRuleIndex === null
      ? null
      : (variablePricingRules[activeVariablePricingRuleIndex] ?? null);
  const activeRouteDayConfig =
    activeRouteDayConfigIndex === null
      ? null
      : (routeDayConfigs[activeRouteDayConfigIndex] ?? null);
  const activeItemConfig =
    activeItemConfigIndex === null ? null : (itemConfigs[activeItemConfigIndex] ?? null);
  const hasUnsavedNewProductChanges = useMemo(() => {
    if (mode !== "new") return false;

    return (
      hasNewProductFormChanges(form) ||
      productContractMode !== "onDemand" ||
      productOperatingMode !== "everyDay" ||
      !areConfigsEqual(productPeriodConfigs, initialProductPeriodConfigs) ||
      shortDescription.trim() !== "" ||
      isMeetingPointsEnabled !== true ||
      additionalMeetingPointConfigs.length > 0 ||
      mapLink.trim() !== "" ||
      !areCommunicationChannelsEqual(communicationChannels, defaultCommunicationChannels) ||
      !areSalesChannelsEqual(salesChannels, defaultSalesChannels) ||
      preEventReminderHours !== "24" ||
      sameDayReminderHours !== "0" ||
      minimumParticipants.trim() !== "" ||
      maximumParticipants.trim() !== "" ||
      durationDays.trim() !== "" ||
      productChargeMode !== defaultProductChargeMode ||
      hasConfiguredVariableTariff ||
      !areConfigsEqual(variablePricingRules, initialVariablePricingRules) ||
      nextVariablePricingRuleOrder !== 2 ||
      productBillingBase !== defaultProductBillingBase ||
      closedGroupPrice !== defaultClosedGroupPrice ||
      isDepositEnabled !== defaultIsDepositEnabled ||
      depositChargeMode !== defaultDepositChargeMode ||
      depositPercentage !== defaultDepositPercentage ||
      depositFixedValue !== defaultDepositFixedValue ||
      depositDueDate !== defaultDepositDueDate ||
      onlineSurchargePercent !== defaultOnlineSurchargePercent ||
      reservationConfirmationMode !== defaultReservationConfirmationMode ||
      cartHoldTimeMinutes !== defaultCartHoldTimeMinutes ||
      paymentProxy !== defaultPaymentProxy ||
      installmentCount !== defaultInstallmentCount ||
      !arePaymentMethodsEqual(paymentMethods, defaultPaymentMethods) ||
      creditCardSurchargePercent !== defaultCreditCardSurchargePercent ||
      pixDiscountPercent !== defaultPixDiscountPercent ||
      isPromotionalPriceEnabled !== true ||
      promotionalPrice !== defaultPromotionalPrice ||
      promotionStartDate.trim() !== "" ||
      promotionEndDate.trim() !== "" ||
      responsibilityTermTitle !== defaultResponsibilityTermTitle ||
      responsibilityTermText !== defaultResponsibilityTermText ||
      advancedStockSku !== "SAM-CEL-S24-CZ-256" ||
      advancedStockBarcode !== "7622300847791" ||
      !areAdvancedStockTogglesEqual(advancedStockToggles, defaultAdvancedStockToggles) ||
      !areConfigsEqual(routeDayConfigs, initialRouteDayConfigs) ||
      !areConfigsEqual(itemConfigs, initialItemConfigs) ||
      voucherInstructions !== defaultWhatsappTemplateBody ||
      preEventMessage !== defaultEmailTemplateBody ||
      isProductItemsEnabled !== true ||
      isProductCollaboratorsEnabled !== true ||
      isTransportIncluded !== true ||
      productUrlSlug.trim() !== "" ||
      !areConfigsEqual(selectedSuggestedProductNames, defaultSuggestedProductNames) ||
      isStorefrontFeatured !== true ||
      seoPageTitle.trim() !== "" ||
      seoMetaDescription.trim() !== "" ||
      isCustomJavascriptEnabled !== true ||
      customJavascript.trim() !== "" ||
      selectedCountryCode !== DEFAULT_COUNTRY_CODE ||
      selectedStateCode !== undefined ||
      selectedCityId !== undefined ||
      !areConfigsEqual(scheduleSlots, initialScheduleTimeSlots) ||
      nextScheduleSlotOrder !== 2
    );
  }, [
    advancedStockBarcode,
    advancedStockSku,
    advancedStockToggles,
    additionalMeetingPointConfigs,
    cartHoldTimeMinutes,
    closedGroupPrice,
    communicationChannels,
    creditCardSurchargePercent,
    customJavascript,
    depositChargeMode,
    depositDueDate,
    depositFixedValue,
    depositPercentage,
    durationDays,
    form,
    hasConfiguredVariableTariff,
    installmentCount,
    isCustomJavascriptEnabled,
    isProductCollaboratorsEnabled,
    isDepositEnabled,
    isMeetingPointsEnabled,
    isPromotionalPriceEnabled,
    isProductItemsEnabled,
    isStorefrontFeatured,
    isTransportIncluded,
    itemConfigs,
    mapLink,
    maximumParticipants,
    minimumParticipants,
    mode,
    nextScheduleSlotOrder,
    nextVariablePricingRuleOrder,
    onlineSurchargePercent,
    preEventMessage,
    preEventReminderHours,
    paymentProxy,
    paymentMethods,
    pixDiscountPercent,
    productChargeMode,
    productBillingBase,
    promotionalPrice,
    promotionEndDate,
    promotionStartDate,
    productContractMode,
    productOperatingMode,
    productPeriodConfigs,
    productUrlSlug,
    reservationConfirmationMode,
    responsibilityTermText,
    responsibilityTermTitle,
    routeDayConfigs,
    sameDayReminderHours,
    salesChannels,
    scheduleSlots,
    selectedCityId,
    selectedCountryCode,
    selectedStateCode,
    selectedSuggestedProductNames,
    seoMetaDescription,
    seoPageTitle,
    shortDescription,
    variablePricingRules,
    voucherInstructions,
  ]);
  const requestClose = () => {
    if (hasUnsavedNewProductChanges) {
      setIsExitConfirmationOpen(true);
      return;
    }

    onClose();
  };
  const clearProductPublicUrlCopiedTimeout = useCallback(() => {
    if (productPublicUrlCopiedTimeoutRef.current === null) return;
    window.clearTimeout(productPublicUrlCopiedTimeoutRef.current);
    productPublicUrlCopiedTimeoutRef.current = null;
  }, []);
  useEffect(() => clearProductPublicUrlCopiedTimeout, [clearProductPublicUrlCopiedTimeout]);
  const copyProductPublicUrl = () => {
    clearProductPublicUrlCopiedTimeout();
    setIsProductPublicUrlCopied(true);
    productPublicUrlCopiedTimeoutRef.current = window.setTimeout(() => {
      setIsProductPublicUrlCopied(false);
      productPublicUrlCopiedTimeoutRef.current = null;
    }, 2_000);
    if (typeof navigator === "undefined") return;
    void navigator.clipboard?.writeText(productPublicUrl).catch(() => undefined);
  };
  const closeWithoutSaving = () => {
    setIsExitConfirmationOpen(false);
    onClose({ discardNewProductDraft: true });
  };
  const saveDraftAndClose = () => {
    setIsExitConfirmationOpen(false);
    onClose();
  };
  const addRouteDay = () => {
    setRouteDayConfigs((currentConfigs) => [...currentConfigs, emptyRouteDayConfig]);
  };
  const addProductPeriod = () => {
    setProductPeriodConfigs((currentConfigs) => [
      ...currentConfigs,
      createEmptyProductPeriodConfig(getNextProductPeriodOrder(currentConfigs)),
    ]);
  };
  const addMeetingPoint = () => {
    setAdditionalMeetingPointConfigs((currentConfigs) => [
      ...currentConfigs,
      createEmptyMeetingPointConfig(getNextMeetingPointOrder(currentConfigs)),
    ]);
  };
  const updateAdditionalMeetingPoint = (
    targetId: string,
    field: "name" | "mapLink",
    value: string
  ) => {
    setAdditionalMeetingPointConfigs((currentConfigs) =>
      currentConfigs.map((config) =>
        config.id === targetId
          ? {
              ...config,
              [field]: value,
            }
          : config
      )
    );
  };
  const removeAdditionalMeetingPoint = (targetId: string) => {
    setAdditionalMeetingPointConfigs((currentConfigs) =>
      currentConfigs.filter((config) => config.id !== targetId)
    );
  };
  const removePrimaryMeetingPoint = () => {
    const nextPrimaryMeetingPoint = additionalMeetingPointConfigs[0];
    if (!nextPrimaryMeetingPoint) return;

    updateForm("pontoEncontro", nextPrimaryMeetingPoint.name);
    setMapLink(nextPrimaryMeetingPoint.mapLink);
    setAdditionalMeetingPointConfigs(additionalMeetingPointConfigs.slice(1));
  };
  const addVariablePricingRule = () => {
    const nextRuleOrder = nextVariablePricingRuleOrder;
    setVariablePricingRules((currentRules) => [
      ...currentRules,
      createEmptyVariablePricingRule(nextRuleOrder),
    ]);
    setNextVariablePricingRuleOrder(nextRuleOrder + 1);
  };
  const removeVariablePricingRule = (targetIndex: number) => {
    setVariablePricingRules((currentRules) => {
      const nextRules = currentRules.filter((_, index) => index !== targetIndex);
      return nextRules.length > 0 ? nextRules : initialVariablePricingRules;
    });
    setActiveVariablePricingRuleIndex(null);
  };
  const requestVariablePricingRuleRemoval = (targetIndex: number, rule: VariablePricingRule) => {
    if (hasVariablePricingRuleConfig(rule)) {
      setPendingVariablePricingRuleRemovalIndex(targetIndex);
      return;
    }

    removeVariablePricingRule(targetIndex);
  };
  const confirmVariablePricingRuleRemoval = () => {
    if (pendingVariablePricingRuleRemovalIndex !== null) {
      removeVariablePricingRule(pendingVariablePricingRuleRemovalIndex);
    }
    setPendingVariablePricingRuleRemovalIndex(null);
  };
  const removeProductPeriod = (targetIndex: number) => {
    setProductPeriodConfigs((currentConfigs) => {
      const nextConfigs = currentConfigs.filter((_, index) => index !== targetIndex);
      return nextConfigs.length > 0 ? nextConfigs : [emptyProductPeriodConfig];
    });
    setActiveProductPeriodConfigIndex(null);
  };
  const requestProductPeriodRemoval = (targetIndex: number, config: ProductPeriodConfig) => {
    if (hasProductPeriodConfig(config)) {
      setPendingProductPeriodRemovalIndex(targetIndex);
      return;
    }

    removeProductPeriod(targetIndex);
  };
  const confirmProductPeriodRemoval = () => {
    if (pendingProductPeriodRemovalIndex !== null) {
      removeProductPeriod(pendingProductPeriodRemovalIndex);
    }
    setPendingProductPeriodRemovalIndex(null);
  };
  const removeRouteDay = (targetIndex: number) => {
    setRouteDayConfigs((currentConfigs) => {
      const nextConfigs = currentConfigs.filter((_, index) => index !== targetIndex);
      return nextConfigs.length > 0 ? nextConfigs : [emptyRouteDayConfig];
    });
  };
  const moveRouteDay = useCallback((sourceIndex: number, targetIndex: number) => {
    setRouteDayConfigs((currentConfigs) => {
      if (
        sourceIndex === targetIndex ||
        sourceIndex < 0 ||
        targetIndex < 0 ||
        sourceIndex >= currentConfigs.length ||
        targetIndex >= currentConfigs.length
      ) {
        return currentConfigs;
      }

      const nextConfigs = [...currentConfigs];
      const sourceConfig = nextConfigs[sourceIndex];

      if (!sourceConfig) return currentConfigs;

      nextConfigs.splice(sourceIndex, 1);
      nextConfigs.splice(targetIndex, 0, sourceConfig);

      return nextConfigs;
    });
  }, []);
  const handleRouteDayPointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    sourceIndex: number
  ) => {
    if (routeDayConfigs.length < 2) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const cardElement = event.currentTarget.closest('[data-route-day-card="true"]');
    const listElement = event.currentTarget.closest('[data-route-day-list="true"]');
    const cardElements =
      listElement instanceof HTMLElement
        ? Array.from(listElement.querySelectorAll('[data-route-day-card="true"]'))
        : [];
    const rowHeight =
      cardElement instanceof HTMLElement ? cardElement.getBoundingClientRect().height : 0;
    const cardCentersY = cardElements.map((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });

    const nextDragState = {
      sourceIndex,
      targetIndex: sourceIndex,
      pointerId: event.pointerId,
      startClientY: event.clientY,
      currentClientY: event.clientY,
      rowHeight,
      cardCentersY,
    };

    routeDayDragStateRef.current = nextDragState;
    setRouteDayDragState(nextDragState);
  };
  const updateRouteDayPointerDrag = useCallback((pointerId: number, clientY: number) => {
    const currentState = routeDayDragStateRef.current;

    if (!currentState || currentState.pointerId !== pointerId) return;

    const targetIndex = getRouteDayReorderTargetIndex({
      sourceIndex: currentState.sourceIndex,
      currentClientY: clientY,
      cardCentersY: currentState.cardCentersY,
    });

    const nextDragState = {
      ...currentState,
      currentClientY: clientY,
      targetIndex,
    };

    routeDayDragStateRef.current = nextDragState;
    setRouteDayDragState(nextDragState);
  }, []);
  const releaseRouteDayPointerCapture = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const commitRouteDayPointerDrag = useCallback(
    (pointerId: number, clientY: number) => {
      const currentState = routeDayDragStateRef.current;

      if (!currentState || currentState.pointerId !== pointerId) return;

      const targetIndex = getRouteDayReorderTargetIndex({
        sourceIndex: currentState.sourceIndex,
        currentClientY: clientY,
        cardCentersY: currentState.cardCentersY,
      });

      if (targetIndex !== currentState.sourceIndex) {
        moveRouteDay(currentState.sourceIndex, targetIndex);
      }

      routeDayDragStateRef.current = null;
      setRouteDayDragState(null);
    },
    [moveRouteDay]
  );
  const resetRouteDayPointerDrag = useCallback((pointerId: number) => {
    const currentState = routeDayDragStateRef.current;

    if (!currentState || currentState.pointerId !== pointerId) return;

    routeDayDragStateRef.current = null;
    setRouteDayDragState(null);
  }, []);
  const handleRouteDayPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    updateRouteDayPointerDrag(event.pointerId, event.clientY);
  };
  const finishRouteDayPointerDrag = (event: PointerEvent<HTMLButtonElement>) => {
    releaseRouteDayPointerCapture(event);
    commitRouteDayPointerDrag(event.pointerId, event.clientY);
  };
  const cancelRouteDayPointerDrag = (event: PointerEvent<HTMLButtonElement>) => {
    releaseRouteDayPointerCapture(event);
    resetRouteDayPointerDrag(event.pointerId);
  };
  useEffect(() => {
    if (!routeDayDragState) return undefined;

    const handleWindowPointerMove = (event: globalThis.PointerEvent) => {
      const currentState = routeDayDragStateRef.current;

      if (!currentState || currentState.pointerId !== event.pointerId) return;

      event.preventDefault();
      updateRouteDayPointerDrag(event.pointerId, event.clientY);
    };
    const handleWindowPointerUp = (event: globalThis.PointerEvent) => {
      commitRouteDayPointerDrag(event.pointerId, event.clientY);
    };
    const handleWindowPointerCancel = (event: globalThis.PointerEvent) => {
      resetRouteDayPointerDrag(event.pointerId);
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: false });
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerCancel);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
    };
  }, [
    commitRouteDayPointerDrag,
    resetRouteDayPointerDrag,
    routeDayDragState,
    updateRouteDayPointerDrag,
  ]);
  const handleRouteDayReorderKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    sourceIndex: number
  ) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveRouteDay(sourceIndex, Math.max(0, sourceIndex - 1));
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveRouteDay(sourceIndex, Math.min(routeDayConfigs.length - 1, sourceIndex + 1));
    }
  };
  const getRouteDayReorderOffset = (index: number) => {
    if (!routeDayDragState) return 0;

    const movementUnit = routeDayDragState.rowHeight + routeDayReorderGap;

    if (index === routeDayDragState.sourceIndex) {
      return routeDayDragState.currentClientY - routeDayDragState.startClientY;
    }

    if (
      routeDayDragState.targetIndex > routeDayDragState.sourceIndex &&
      index > routeDayDragState.sourceIndex &&
      index <= routeDayDragState.targetIndex
    ) {
      return -movementUnit;
    }

    if (
      routeDayDragState.targetIndex < routeDayDragState.sourceIndex &&
      index >= routeDayDragState.targetIndex &&
      index < routeDayDragState.sourceIndex
    ) {
      return movementUnit;
    }

    return 0;
  };
  const requestRouteDayRemoval = (targetIndex: number, config: RouteDayConfig) => {
    if (hasRouteDayConfig(config)) {
      setPendingRouteDayRemovalIndex(targetIndex);
      return;
    }

    removeRouteDay(targetIndex);
  };
  const confirmRouteDayRemoval = () => {
    if (pendingRouteDayRemovalIndex !== null) {
      removeRouteDay(pendingRouteDayRemovalIndex);
    }
    setPendingRouteDayRemovalIndex(null);
  };
  const addItem = () => {
    setItemConfigs((currentConfigs) => [...currentConfigs, emptyItemConfig]);
  };
  const removeItem = (targetIndex: number) => {
    setItemConfigs((currentConfigs) => {
      const removedConfig = currentConfigs[targetIndex];
      const nextConfigs = currentConfigs.filter((_, index) => index !== targetIndex);

      if (
        removedConfig &&
        hasItemConfig(removedConfig) &&
        !nextConfigs.some((config) => hasItemConfig(config))
      ) {
        return [emptyItemConfig];
      }

      return nextConfigs.length > 0 ? nextConfigs : [emptyItemConfig];
    });
    setActiveItemConfigIndex(null);
  };
  const requestItemRemoval = (targetIndex: number, config: ItemConfig) => {
    if (hasItemConfig(config)) {
      setPendingItemRemovalIndex(targetIndex);
      return;
    }

    removeItem(targetIndex);
  };
  const confirmItemRemoval = () => {
    if (pendingItemRemovalIndex !== null) {
      removeItem(pendingItemRemovalIndex);
    }
    setPendingItemRemovalIndex(null);
  };
  const isBrazilSelected = selectedCountryCode === DEFAULT_COUNTRY_CODE;
  const cityOptions = useMemo(
    () => getBrazilCitiesForState(brazilCities, selectedStateCode),
    [brazilCities, selectedStateCode]
  );
  const citySelectOptions = useMemo(
    () => cityOptions.map((city) => ({ value: city.id, label: city.name })),
    [cityOptions]
  );

  const updateCountry = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    setSelectedStateCode(undefined);
    setSelectedCityId(undefined);
  };

  const updateState = (stateCode: string) => {
    setSelectedStateCode(stateCode);
    setSelectedCityId(undefined);
  };

  const updateAdvancedStockToggle = (id: AdvancedStockToggleId, checked: boolean) => {
    setAdvancedStockToggles((currentToggles) => ({
      ...currentToggles,
      [id]: checked,
    }));
  };
  const newProductHeaderName = mode === "new" ? form.nome.trim() : "";
  const productFlowHeaderTitle =
    mode === "new" ? newProductHeaderName || "Novo produto" : form.nome.trim() || "Editar produto";
  const isNewProductHeaderNamed = newProductHeaderName.length > 0;

  return (
    <form
      onSubmit={onSave}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#f8fafc]"
    >
      <header className="flex h-[61px] shrink-0 items-center border-b border-[#e9eaeb] bg-white px-5">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src="/src/assets/retrilhar-logo.png"
            alt="Retrilhar"
            className="h-6 w-[97px] shrink-0 object-contain"
          />
          <span className="hidden h-5 w-px shrink-0 bg-[#e9eaeb] sm:block" />
          <div className="flex min-w-0 items-center gap-2">
            <p
              className={`truncate font-['Helvetica_Neue:Regular',sans-serif] text-[#252b37] ${
                isNewProductHeaderNamed ? "text-base" : "text-sm"
              }`}
            >
              {productFlowHeaderTitle}
            </p>
            <span className="rounded-md bg-[#fffaeb] px-2 py-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#dc6803]">
              Rascunho
            </span>
          </div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isHistoryOpen}
            onClick={() => setIsHistoryOpen(true)}
            className="hidden h-9 items-center justify-center gap-2 rounded-[6px] border border-transparent bg-transparent pr-2 pl-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#535862] transition-colors hover:bg-[#f8fafc] hover:text-[#252b37] md:flex"
          >
            <HugeiconsIcon icon={Clock04Icon} size={16} strokeWidth={1.5} aria-hidden="true" />
            Histórico
          </button>
          <button
            type="submit"
            className="h-9 rounded-lg border border-transparent bg-transparent pr-3 pl-2 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors hover:bg-[#f8fafc] hover:text-[#252b37]"
          >
            Salvar rascunho
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-lg px-4 font-['Helvetica_Neue:Medium',sans-serif] text-sm transition-colors"
          >
            Publicar produto
          </button>
          <button
            type="button"
            onClick={requestClose}
            className="flex h-9 items-center gap-2 rounded-lg border border-[#e9eaeb] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#535862] transition-colors hover:bg-[#f8fafc]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} aria-hidden="true" />
            Fechar
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <ProductFlowStepper activeSection={activeSection} onActivate={activateStep} />

        <main
          ref={productFlowMainRef}
          onScroll={updateActiveSectionFromScroll}
          className="min-w-0 flex-1 overflow-y-auto"
        >
          <div className="flex w-full max-w-[1188px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
            <div className="flex w-full max-w-[774px] shrink-0 flex-col gap-6">
              <SectionCard
                id="info"
                title="Informações do produto"
                description="Identificação, descrição e localização do item que será criado."
              >
                <div className="flex w-full flex-col gap-2.5">
                  <SectionLabel>O que você está vendendo?</SectionLabel>
                  <Select value={form.tipo} onValueChange={(value) => updateForm("tipo", value)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      className={selectContentClass}
                    >
                      {productTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2.5">
                  <SectionLabel>Nome e descrição</SectionLabel>
                  <div className="flex flex-col gap-1">
                    <Field label="Nome do produto" required>
                      <input
                        className={inputClass}
                        value={form.nome}
                        onChange={(event) => updateForm("nome", event.target.value)}
                        placeholder="Insira o nome do produto"
                        maxLength={75}
                      />
                      <p className="text-right font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                        {form.nome.length}/75 caracteres
                      </p>
                    </Field>
                    <Field label="Descrição curta">
                      <input
                        className={inputClass}
                        value={shortDescription}
                        onChange={(event) => setShortDescription(event.target.value)}
                        placeholder="Insira o resumo que irá aparecer nos cards e chamadas"
                        maxLength={150}
                      />
                      <p className="text-right font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                        {shortDescription.length}/150 caracteres
                      </p>
                    </Field>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                        Descrição completa
                      </span>
                      <ProductDescriptionEditor
                        value={form.descricao}
                        onChange={(value) => updateForm("descricao", value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <SectionLabel>Imagens do produto</SectionLabel>
                  <button
                    type="button"
                    className="hover:border-primary hover:bg-primary/5 flex min-h-[124px] flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[#d5d7da] bg-[#fbfcfd] px-6 py-8 text-[#717680] transition-colors"
                  >
                    <HugeiconsIcon icon={ImageUploadIcon} size={28} aria-hidden="true" />
                    <span className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[19.5px]">
                      Arraste imagens ou clique para enviar
                    </span>
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  <SectionLabel>Localização</SectionLabel>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <Field label="País">
                        <Select value={selectedCountryCode} onValueChange={updateCountry}>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            side="bottom"
                            align="start"
                            avoidCollisions={false}
                            className={selectContentClass}
                          >
                            {countryOptions.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Estado">
                        <Select
                          value={selectedStateCode}
                          onValueChange={updateState}
                          disabled={!isBrazilSelected}
                        >
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            side="bottom"
                            align="start"
                            avoidCollisions={false}
                            className={selectContentClass}
                          >
                            {brazilStates.map((state) => (
                              <SelectItem key={state.code} value={state.code}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Cidade">
                        <VirtualizedLocationSelect
                          label="Cidade"
                          value={selectedCityId}
                          onValueChange={setSelectedCityId}
                          options={citySelectOptions}
                          placeholder="Selecione"
                          disabled={!isBrazilSelected}
                        />
                      </Field>
                    </div>
                    <MapLinkField
                      value={mapLink}
                      onChange={setMapLink}
                      onOpen={() => {
                        const targetUrl = mapLink.trim() || "https://www.google.com/maps";
                        window.open(targetUrl, "_blank", "noopener,noreferrer");
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <SectionLabel>Pontos de encontro</SectionLabel>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                          Habilitar pontos de encontro
                        </p>
                        <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
                          Defina um ou mais locais onde o participante deve se apresentar.
                        </p>
                      </div>
                      <Switch
                        checked={isMeetingPointsEnabled}
                        onCheckedChange={setIsMeetingPointsEnabled}
                        aria-label="Habilitar pontos de encontro"
                      />
                    </div>
                    {isMeetingPointsEnabled ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3 rounded-xl border border-[#e5e5e5] bg-[#f5f5f5]/40 px-4 py-3">
                          <MeetingPointNameField
                            label="Ponto de encontro 1"
                            value={form.pontoEncontro}
                            onChange={(value) => updateForm("pontoEncontro", value)}
                            placeholder="Ex.: Portaria do Parque Estadual"
                            onRemove={removePrimaryMeetingPoint}
                            removeDisabled={additionalMeetingPointConfigs.length === 0}
                          />
                        </div>
                        {additionalMeetingPointConfigs.map((config, index) => (
                          <div
                            key={config.id}
                            className="flex flex-col gap-3 rounded-xl border border-[#e5e5e5] bg-[#f5f5f5]/40 px-4 py-3"
                          >
                            <MeetingPointNameField
                              label={`Ponto de encontro ${index + 2}`}
                              value={config.name}
                              onChange={(value) =>
                                updateAdditionalMeetingPoint(config.id, "name", value)
                              }
                              placeholder="Ex.: Segundo acesso do parque"
                              onRemove={() => removeAdditionalMeetingPoint(config.id)}
                              removeDisabled={false}
                            />
                          </div>
                        ))}
                        <DashedAddButton onClick={addMeetingPoint}>Adicionar ponto</DashedAddButton>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <SectionLabel>Transporte</SectionLabel>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                          Transporte incluso
                        </p>
                        <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
                          O produto contempla deslocamento a partir de um ponto de origem.
                        </p>
                      </div>
                      <Switch
                        checked={isTransportIncluded}
                        onCheckedChange={setIsTransportIncluded}
                        aria-label="Transporte incluso"
                      />
                    </div>
                    {isTransportIncluded ? (
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Cidade de origem">
                          <Select>
                            <SelectTrigger className={selectTriggerClass}>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              side="bottom"
                              align="start"
                              className={selectContentClass}
                            >
                              <SelectItem value="São Domingos">São Domingos</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="UF de origem">
                          <Select>
                            <SelectTrigger className={selectTriggerClass}>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              side="bottom"
                              align="start"
                              className={selectContentClass}
                            >
                              <SelectItem value="GO">GO</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>
                    ) : null}
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="schedule"
                title="Programação e vagas"
                description="Quando este produto acontece, quantas pessoas atende e como funciona a logística."
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2.5">
                      <SectionLabel>Forma de contratação</SectionLabel>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CategoryButton
                          icon={CalendarUserIcon}
                          title="Sob demanda"
                          description="O produto fica à venda todos os dias, sem precisar cadastrar datas. Se quiser, você limita os dias de funcionamento logo abaixo."
                          active={productContractMode === "onDemand"}
                          onClick={() => setProductContractMode("onDemand")}
                        />
                        <CategoryButton
                          icon={Calendar03Icon}
                          title="Apenas com evento"
                          description="O produto só fica à venda nas datas que você criar como eventos na agenda. Cada data pode ter vagas, horários e preços próprios."
                          active={productContractMode === "eventOnly"}
                          onClick={() => setProductContractMode("eventOnly")}
                        />
                      </div>
                    </div>

                    {productContractMode === "eventOnly" ? <ProductEventOnlyNotice /> : null}
                  </div>

                  {productContractMode === "eventOnly" ? null : (
                    <div className="flex flex-col gap-2.5">
                      <SectionLabel>Funcionamento</SectionLabel>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CategoryButton
                          icon={Calendar03Icon}
                          title="Todos os dias"
                          description="O produto fica disponível continuamente, sem nenhuma configuração extra."
                          active={productOperatingMode === "everyDay"}
                          onClick={() => setProductOperatingMode("everyDay")}
                        />
                        <CategoryButton
                          icon={CalendarUserIcon}
                          title="Com períodos específicos"
                          description="O produto funciona só nos períodos e dias cadastrados aqui. Exemplos: fins de semana e etc..."
                          active={productOperatingMode === "specificPeriods"}
                          onClick={() => setProductOperatingMode("specificPeriods")}
                        />
                      </div>
                    </div>
                  )}

                  {productContractMode === "onDemand" &&
                  productOperatingMode === "specificPeriods" ? (
                    <>
                      <ProductSpecificPeriodsNotice />

                      <div className="flex flex-col gap-2.5">
                        <SectionLabel>PERÍODOS</SectionLabel>
                        <div className="flex flex-col gap-3">
                          {productPeriodConfigs.map((config, index) => (
                            <ScheduleRow
                              key={config.id}
                              title={`Período ${index + 1}`}
                              description={
                                productPeriodDescriptions[index] ??
                                createProductPeriodDescription(config)
                              }
                              deletable={
                                productPeriodConfigs.length > 1 || hasProductPeriodConfig(config)
                              }
                              onEdit={() => setActiveProductPeriodConfigIndex(index)}
                              onDelete={() => requestProductPeriodRemoval(index, config)}
                            />
                          ))}
                          <DashedAddButton onClick={addProductPeriod}>
                            Adicionar período
                          </DashedAddButton>
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="flex flex-col gap-2.5">
                    <SectionLabel>Capacidade e duração</SectionLabel>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                      <Field label="Participantes (mínimo)">
                        <input
                          className={inputClass}
                          inputMode="numeric"
                          pattern="[0-9.]*"
                          placeholder="Ex.: 1"
                          value={minimumParticipants}
                          onChange={(event) =>
                            setMinimumParticipants(formatIntegerInput(event.target.value))
                          }
                        />
                      </Field>
                      <Field label="Participantes (máximo)">
                        <input
                          className={inputClass}
                          inputMode="numeric"
                          pattern="[0-9.]*"
                          placeholder="Ex.: 45"
                          value={maximumParticipants}
                          onChange={(event) =>
                            setMaximumParticipants(formatIntegerInput(event.target.value))
                          }
                        />
                      </Field>
                      <Field label="Quantidade de dias">
                        <input
                          className={inputClass}
                          inputMode="numeric"
                          pattern="[0-9.]*"
                          placeholder="0"
                          value={durationDays}
                          onChange={(event) =>
                            setDurationDays(formatIntegerInput(event.target.value))
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <SectionLabel>HORÁRIOS</SectionLabel>
                    <ScheduleRulesList
                      slots={scheduleSlots}
                      setSlots={setScheduleSlots}
                      nextOrder={nextScheduleSlotOrder}
                      setNextOrder={setNextScheduleSlotOrder}
                    />
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <SectionLabel>Roteiro</SectionLabel>
                    <div className="flex flex-col gap-3" data-route-day-list="true">
                      {routeDayConfigs.map((config, index) => (
                        <ScheduleRow
                          key={`route-day-${index}`}
                          title={`Dia ${index + 1}`}
                          titleDetail={config.title.trim()}
                          description={
                            routeDayDescriptions[index] ?? createRouteDayDescription(config)
                          }
                          deletable={routeDayConfigs.length > 1 || hasRouteDayConfig(config)}
                          reorder={{
                            enabled: routeDayConfigs.length > 1,
                            active: routeDayDragState?.sourceIndex === index,
                            offsetY: getRouteDayReorderOffset(index),
                            onPointerDown: (event) => handleRouteDayPointerDown(event, index),
                            onPointerMove: handleRouteDayPointerMove,
                            onPointerUp: finishRouteDayPointerDrag,
                            onPointerCancel: cancelRouteDayPointerDrag,
                            onKeyDown: (event) => handleRouteDayReorderKeyDown(event, index),
                          }}
                          onEdit={() => setActiveRouteDayConfigIndex(index)}
                          onDelete={() => requestRouteDayRemoval(index, config)}
                        />
                      ))}
                      <DashedAddButton onClick={addRouteDay}>Adicionar roteiro</DashedAddButton>
                    </div>
                  </div>

                  <div
                    id="produto-itens"
                    ref={productItemsSectionRef}
                    data-product-items-highlighted={isProductItemsHighlighted ? "true" : undefined}
                    className={`-m-2 flex scroll-mt-6 flex-col gap-2.5 rounded-[12px] p-2 transition-[background-color,box-shadow] duration-700 ease-out ${
                      isProductItemsHighlighted
                        ? "bg-[#f8fafc] shadow-[0_0_0_3px_rgba(148,163,184,0.18)]"
                        : "bg-transparent shadow-none"
                    }`}
                  >
                    <SectionLabel>Itens do produto</SectionLabel>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#181d27]">
                            Habilitar atribuição de itens
                          </p>
                          <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-4 text-[#717680]">
                            Você escolhe adicionar itens que já vem inclusos no produto e/ou itens
                            adicionais.
                          </p>
                        </div>
                        <Switch
                          checked={isProductItemsEnabled}
                          onCheckedChange={setIsProductItemsEnabled}
                          aria-label="Habilitar atribuição de itens"
                        />
                      </div>
                      {isProductItemsEnabled ? (
                        <div className="flex flex-col gap-3">
                          {itemConfigs.map((config, index) => (
                            <ScheduleRow
                              key={`item-${index}`}
                              title={config.item.trim() || `Item ${index + 1}`}
                              description={itemDescriptions[index] ?? createItemDescription(config)}
                              deletable={itemConfigs.length > 1 || hasItemConfig(config)}
                              onEdit={() => setActiveItemConfigIndex(index)}
                              onDelete={() => requestItemRemoval(index, config)}
                            />
                          ))}
                          <DashedAddButton onClick={addItem}>Adicionar item</DashedAddButton>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <ProductCollaboratorsSection
                    enabled={isProductCollaboratorsEnabled}
                    onEnabledChange={setIsProductCollaboratorsEnabled}
                  />

                  <div className="overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white">
                    <button
                      type="button"
                      aria-expanded={isAdvancedStockOpen}
                      aria-controls="produto-advanced-stock-panel"
                      onClick={() => setIsAdvancedStockOpen((isOpen) => !isOpen)}
                      className="flex h-10 w-full items-center gap-2 px-4 py-3 text-left font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] transition-colors hover:bg-[#f8fafc]"
                    >
                      <span className="min-w-0 flex-1">Configurações avançadas de estoque</span>
                      <HugeiconsIcon
                        icon={isAdvancedStockOpen ? ArrowUp01Icon : ArrowDown01Icon}
                        size={20}
                        aria-hidden="true"
                        className="shrink-0 text-[#535862]"
                      />
                    </button>
                    {isAdvancedStockOpen ? (
                      <div
                        id="produto-advanced-stock-panel"
                        className="flex min-h-[327px] flex-col gap-4 border-t border-[#f5f5f5] p-4"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <Field label="SKU (Unidade de Manutenção de Estoque)">
                            <input
                              className={inputClass}
                              placeholder="Ex.: LV-CAL-SLIM-PR-42"
                              value={advancedStockSku}
                              onChange={(event) => setAdvancedStockSku(event.target.value)}
                            />
                          </Field>
                          <Field label="Código de barras">
                            <input
                              className={inputClass}
                              placeholder="Ex.: 7891234567890"
                              value={advancedStockBarcode}
                              onChange={(event) => setAdvancedStockBarcode(event.target.value)}
                            />
                          </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                          {advancedStockToggleOptions.map((option, index) => (
                            <Fragment key={option.id}>
                              <AdvancedStockToggleRow
                                title={option.title}
                                description={option.description}
                                checked={advancedStockToggles[option.id]}
                                onCheckedChange={(checked) =>
                                  updateAdvancedStockToggle(option.id, checked)
                                }
                              />
                              {index < advancedStockToggleOptions.length - 1 ? (
                                <div className="h-px bg-[#f5f5f5]" />
                              ) : null}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div
                        id="produto-advanced-stock-panel"
                        className="border-t border-[#f5f5f5] px-4 py-3"
                      >
                        <div className="flex flex-wrap gap-2.5">
                          {advancedStockBadges.map((badge) => (
                            <ScheduleBadge
                              key={`${badge.label}-${badge.value}`}
                              label={badge.label}
                              value={badge.value}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="pricing"
                title="Preço e pagamento"
                description="Como o produto é cobrado, valores, tarifário e regras da reserva."
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-[10px]">
                    <SectionLabel>Valor do anúncio</SectionLabel>
                    <Field label="Valor exibido no e-commerce e chamadas">
                      <input
                        className={`${inputClass} text-[#414651] placeholder:text-[#94a3b8]`}
                        value={form.preco}
                        onChange={(event) =>
                          updateForm("preco", formatCurrencyInput(event.target.value))
                        }
                        placeholder="0"
                        inputMode="decimal"
                      />
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                        Com vários eventos de valores diferentes, o "a partir de" usa sempre o menor
                        valor entre os eventos.
                      </p>
                    </Field>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <SectionLabel>Tipo de cobrança</SectionLabel>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <CategoryButton
                        icon={ReceiptDollarIcon}
                        title="Preço simplificado"
                        description="Um único preço para o produto, com as configurações de pagamento. Para cobranças simples."
                        active={productChargeMode === "simplified"}
                        compact
                        onClick={() => setProductChargeMode("simplified")}
                      />
                      <CategoryButton
                        icon={CalendarClockIcon}
                        title="Preços variáveis (tarifário)"
                        description="Cobranças distintas para o mesmo produto: por perfil, lote ou tipo de dia. Abre o cadastro do tarifário."
                        active={productChargeMode === "variableTariff"}
                        compact
                        onClick={() => {
                          setProductChargeMode("variableTariff");
                          setHasConfiguredVariableTariff(true);
                          setProductBillingBase("perPerson");
                        }}
                      />
                    </div>
                  </div>
                  {productChargeMode === "variableTariff" ? (
                    <div className="flex flex-col gap-[10px]">
                      <SectionLabel>REGRAS DAS VARIÁVEIS</SectionLabel>
                      <div className="flex flex-col gap-3">
                        {variablePricingRules.map((rule, index) => (
                          <ScheduleRow
                            key={rule.id}
                            title={`Regra #${index + 1}`}
                            description={
                              variablePricingRuleDescriptions[index] ??
                              createVariablePricingRuleDescription(rule)
                            }
                            deletable={
                              variablePricingRules.length > 1 || hasVariablePricingRuleConfig(rule)
                            }
                            onEdit={() => setActiveVariablePricingRuleIndex(index)}
                            onDelete={() => requestVariablePricingRuleRemoval(index, rule)}
                          />
                        ))}
                        <DashedAddButton onClick={addVariablePricingRule}>
                          Adicionar regra
                        </DashedAddButton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[10px]">
                      <SectionLabel>Base da cobrança</SectionLabel>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <CategoryButton
                          icon={UserDollarIcon}
                          title="Por pessoa (padrão)"
                          description="Um valor único multiplicado pela quantidade de participantes da reserva."
                          active={productBillingBase === "perPerson"}
                          compact
                          onClick={() => setProductBillingBase("perPerson")}
                        />
                        <CategoryButton
                          icon={UserGroup02Icon}
                          title="Por grupo fechado"
                          description="Valor cheio pela saída inteira, independente de quantas pessoas vão."
                          active={productBillingBase === "closedGroup"}
                          compact
                          onClick={() => setProductBillingBase("closedGroup")}
                        />
                        <CategoryButton
                          icon={MoneyExchange03Icon}
                          title="Por soma dos itens"
                          description="O total vem dos itens que o cliente escolhe, sem valor próprio do produto."
                          active={productBillingBase === "itemSum"}
                          compact
                          onClick={() => setProductBillingBase("itemSum")}
                        />
                      </div>
                      {productBillingBase === "closedGroup" ? (
                        <>
                          <Field label="Valor cheio do grupo (R$)">
                            <input
                              className={`${inputClass} text-[#414651] placeholder:text-[#94a3b8]`}
                              value={closedGroupPrice}
                              onChange={(event) =>
                                setClosedGroupPrice(formatCurrencyInput(event.target.value))
                              }
                              placeholder="0"
                              inputMode="decimal"
                            />
                          </Field>
                          {hasConfiguredVariableTariff ? (
                            <div className="rounded-[10px] border border-[#f5f5f5] bg-[#f8f9fc] px-3 py-2">
                              <div className="flex items-start gap-2.5">
                                <svg
                                  className="mt-px size-6 shrink-0"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  aria-hidden="true"
                                >
                                  <circle cx="12" cy="12" r="11" fill="#4A7BF7" opacity="0.15" />
                                  <circle cx="12" cy="12" r="8" fill="#4A7BF7" />
                                  <path
                                    d="M12 16v-4M12 8h.01"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[14px] text-[#414651]">
                                  Este produto está com cobrança por tipo de carrinho: o tarifário
                                  cadastrado{" "}
                                  <span className="font-['Helvetica_Neue:Medium',sans-serif]">
                                    (1 período, 2 tarifas)
                                  </span>{" "}
                                  não será válido até alterar o tipo de cobrança para por pessoa.
                                </p>
                              </div>
                              <button
                                type="button"
                                className="mt-2 ml-[34px] flex h-5 w-fit items-center gap-1.5 rounded-md bg-transparent font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#0b5ed7] transition-colors hover:text-[#084fb7] focus-visible:ring-3 focus-visible:ring-[#1570ef]/20"
                                onClick={() => {
                                  setProductChargeMode("variableTariff");
                                  setProductBillingBase("perPerson");
                                }}
                              >
                                <HugeiconsIcon icon={Undo02Icon} size={16} aria-hidden="true" />
                                Retornar para preços múltiplos
                              </button>
                            </div>
                          ) : null}
                        </>
                      ) : productBillingBase === "itemSum" ? (
                        <ItemSumBillingNotice onGoToItems={activateProductItems} />
                      ) : (
                        <Field label="Preço por pessoa (R$)">
                          <input
                            className={`${inputClass} text-[#414651] placeholder:text-[#94a3b8]`}
                            value={form.preco}
                            onChange={(event) =>
                              updateForm("preco", formatCurrencyInput(event.target.value))
                            }
                            placeholder="0"
                            inputMode="decimal"
                          />
                        </Field>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  <SectionLabel>Configurações de promoção</SectionLabel>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#181d27]">
                          Habilitar preço promocional
                        </p>
                        <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#717680]">
                          O valor com desconto aparece na loja com o preço original riscado.
                        </p>
                      </div>
                      <Switch
                        checked={isPromotionalPriceEnabled}
                        onCheckedChange={setIsPromotionalPriceEnabled}
                        aria-label="Habilitar preço promocional"
                      />
                    </div>

                    {isPromotionalPriceEnabled ? (
                      <>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                          <Field label="Valor promocional (R$)">
                            <input
                              className={`${inputClass} text-[#414651] placeholder:text-[#94a3b8]`}
                              value={promotionalPrice}
                              onChange={(event) =>
                                setPromotionalPrice(formatCurrencyInput(event.target.value))
                              }
                              placeholder="0"
                              inputMode="decimal"
                            />
                          </Field>
                          <Field label="Início da vigência">
                            <div className="relative">
                              <input
                                className={`${inputClass} pr-10 text-[#414651] placeholder:text-[#94a3b8]`}
                                inputMode="numeric"
                                maxLength={10}
                                pattern="[0-9/]*"
                                placeholder="dd/mm/aaaa"
                                value={promotionStartDate}
                                onChange={(event) =>
                                  setPromotionStartDate(formatDateInput(event.target.value))
                                }
                              />
                              <HugeiconsIcon
                                icon={Calendar03Icon}
                                size={20}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#717680]"
                              />
                            </div>
                          </Field>
                          <Field label="Fim da vigência">
                            <div className="relative">
                              <input
                                className={`${inputClass} pr-10 text-[#414651] placeholder:text-[#94a3b8]`}
                                inputMode="numeric"
                                maxLength={10}
                                pattern="[0-9/]*"
                                placeholder="dd/mm/aaaa"
                                value={promotionEndDate}
                                onChange={(event) =>
                                  setPromotionEndDate(formatDateInput(event.target.value))
                                }
                              />
                              <HugeiconsIcon
                                icon={Calendar03Icon}
                                size={20}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#717680]"
                              />
                            </div>
                          </Field>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                            Prévia na loja
                          </p>
                          <div className="w-full rounded-[8px] border border-[#eaecf0] bg-white p-4 md:w-fit md:min-w-[270px]">
                            <div className="flex flex-col gap-1 font-['Helvetica_Neue:Regular',sans-serif] text-[#475467]">
                              {advertisedPromotionPreviewValue ? (
                                <p className="text-xs leading-[18px]">
                                  de{" "}
                                  <span className="line-through">
                                    {advertisedPromotionPreviewValue}
                                  </span>
                                </p>
                              ) : null}
                              <p className="text-sm leading-5 font-semibold">
                                A partir de{" "}
                                <span className="text-base leading-6">
                                  {discountedPromotionPreviewValue ?? "R$ --"}
                                </span>
                                / Por pessoa
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-0">
                  <div className="flex flex-col gap-[10px]">
                    <SectionLabel>Regras da reserva</SectionLabel>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <label className="flex flex-col gap-1.5">
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                          Confirmação da reserva
                        </span>
                        <Select
                          value={reservationConfirmationMode}
                          onValueChange={(value) =>
                            setReservationConfirmationMode(value as ReservationConfirmationMode)
                          }
                        >
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Confirma reserva após pagamento" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            side="bottom"
                            align="start"
                            className={selectContentClass}
                          >
                            {reservationConfirmationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                      <label className="flex flex-col gap-1.5">
                        <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                          Tempo de reserva do carrinho
                        </span>
                        <Select
                          value={cartHoldTimeMinutes}
                          onValueChange={(value) =>
                            setCartHoldTimeMinutes(value as CartHoldTimeMinutes)
                          }
                        >
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="10 minutos após inicio da compra" />
                          </SelectTrigger>
                          <SelectContent
                            position="popper"
                            side="bottom"
                            align="start"
                            className={selectContentClass}
                          >
                            {cartHoldTimeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                          Referente ao tempo em que as vagas ficam retidas no carrinho do comprador
                          antes de ser liberado para outros usuários.
                        </p>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-[10px]">
                      <SectionLabel>Formas de pagamento</SectionLabel>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {paymentMethodOptions.map((option) => (
                          <CategoryButton
                            key={option.id}
                            icon={option.icon}
                            iconNode={option.iconNode}
                            title={option.title}
                            description={option.description}
                            active={paymentMethods.has(option.id)}
                            compact
                            onClick={() => togglePaymentMethod(option.id)}
                          />
                        ))}
                      </div>
                      <div
                        className={`grid grid-cols-1 gap-5 ${
                          paymentMethods.size > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
                        }`}
                      >
                        {paymentMethods.has("creditCard") ? (
                          <Field label="Acréscimo no cartão (%)">
                            <input
                              className={`${inputClass} text-[#414651] placeholder:text-[#94a3b8]`}
                              value={creditCardSurchargePercent}
                              onChange={(event) =>
                                setCreditCardSurchargePercent(
                                  formatPercentInput(event.target.value)
                                )
                              }
                              placeholder="0"
                              inputMode="decimal"
                            />
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                              Repasse da taxa da operadora para o cliente final.
                            </p>
                          </Field>
                        ) : null}
                        {paymentMethods.has("pix") ? (
                          <Field label="Desconto no PIX (%)">
                            <input
                              className={`${inputClass} text-[#414651] placeholder:text-[#94a3b8]`}
                              value={pixDiscountPercent}
                              onChange={(event) =>
                                setPixDiscountPercent(formatPercentInput(event.target.value))
                              }
                              placeholder="0"
                              inputMode="decimal"
                            />
                            <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                              Deixe o campo vazio para cobrar o valor cheio.
                            </p>
                          </Field>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[10px]">
                      <SectionLabel>Configurações de pagamento</SectionLabel>
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <label className="flex flex-col gap-1.5">
                          <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                            Proxy de pagamento
                          </span>
                          <Select
                            value={paymentProxy || undefined}
                            onValueChange={(value) => setPaymentProxy(value as PaymentProxyOption)}
                          >
                            <SelectTrigger
                              className={`${selectTriggerClass} data-[placeholder]:text-[#94a3b8]`}
                            >
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              side="bottom"
                              align="start"
                              className={selectContentClass}
                            >
                              {paymentProxyOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                            Contas de recebimento cadastradas em Integrações.
                          </p>
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                            Parcelas
                          </span>
                          <Select
                            value={installmentCount || undefined}
                            onValueChange={(value) =>
                              setInstallmentCount(readPaymentInstallmentCount(value))
                            }
                          >
                            <SelectTrigger
                              className={`${selectTriggerClass} data-[placeholder]:text-[#94a3b8]`}
                            >
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              side="bottom"
                              align="start"
                              className={`${selectContentClass} max-h-[196px]`}
                            >
                              {paymentInstallmentOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="py-1.5"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                            Quantidade máxima de parcelas
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-[10px]">
                      <SectionLabel>Entrada (sinal)</SectionLabel>
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#181d27]">
                            Habilitar entrada
                          </p>
                          <p className="mt-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#717680]">
                            O cliente paga uma parte ao reservar e o restante até a data limite.
                          </p>
                        </div>
                        <Switch
                          checked={isDepositEnabled}
                          onCheckedChange={setIsDepositEnabled}
                          aria-label="Habilitar entrada"
                        />
                      </div>
                    </div>

                    {isDepositEnabled ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <p className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#414651]">
                            Cobrar entrada em
                          </p>
                          <div className="flex h-12 w-full items-center rounded-full border border-[#f5f5f5] bg-[#fafafa] p-1">
                            <button
                              type="button"
                              aria-pressed={depositChargeMode === "percentage"}
                              onClick={() => setDepositChargeMode("percentage")}
                              className={`flex h-full flex-1 items-center justify-center rounded-full px-3 text-sm leading-[normal] text-[#414651] transition-colors ${
                                depositChargeMode === "percentage"
                                  ? "bg-white font-['Helvetica_Neue:Medium',sans-serif] shadow-[inset_0_0_2px_rgba(0,0,0,0.15)]"
                                  : "font-['Helvetica_Neue:Regular',sans-serif] hover:bg-white/60"
                              }`}
                            >
                              Porcentagem (%)
                            </button>
                            <button
                              type="button"
                              aria-pressed={depositChargeMode === "fixedValue"}
                              onClick={() => setDepositChargeMode("fixedValue")}
                              className={`flex h-full flex-1 items-center justify-center rounded-full px-3 text-sm leading-[normal] text-[#414651] transition-colors ${
                                depositChargeMode === "fixedValue"
                                  ? "bg-white font-['Helvetica_Neue:Medium',sans-serif] shadow-[inset_0_0_2px_rgba(0,0,0,0.15)]"
                                  : "font-['Helvetica_Neue:Regular',sans-serif] hover:bg-white/60"
                              }`}
                            >
                              Valor (R$)
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <Field
                            label={
                              depositChargeMode === "percentage"
                                ? "Percentual de entrada (%)"
                                : "Valor de entrada (R$)"
                            }
                          >
                            <input
                              className={`${inputClass} text-[#717680] placeholder:text-[#94a3b8]`}
                              value={
                                depositChargeMode === "percentage"
                                  ? depositPercentage
                                  : depositFixedValue
                              }
                              onChange={(event) => {
                                if (depositChargeMode === "percentage") {
                                  setDepositPercentage(formatPercentInput(event.target.value));
                                  return;
                                }

                                setDepositFixedValue(formatCurrencyInput(event.target.value));
                              }}
                              placeholder="0"
                              inputMode="decimal"
                            />
                          </Field>
                          <Field label="Pagar valor restante até">
                            <div className="relative">
                              <input
                                className={`${inputClass} pr-10 text-[#717680] placeholder:text-[#94a3b8]`}
                                inputMode="numeric"
                                maxLength={10}
                                pattern="[0-9/]*"
                                placeholder="dd/mm/aaaa"
                                value={depositDueDate}
                                onChange={(event) =>
                                  setDepositDueDate(formatDateInput(event.target.value))
                                }
                              />
                              <HugeiconsIcon
                                icon={Calendar03Icon}
                                size={20}
                                strokeWidth={1.5}
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#717680]"
                              />
                            </div>
                          </Field>
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-[10px]">
                      <SectionLabel>Pagamento online</SectionLabel>
                      <div className="flex flex-col gap-4">
                        <Field label="Percentual de acréscimo para pagamento online (%)">
                          <input
                            className={`${inputClass} text-[#717680] placeholder:text-[#94a3b8]`}
                            value={onlineSurchargePercent}
                            onChange={(event) =>
                              setOnlineSurchargePercent(formatPercentInput(event.target.value))
                            }
                            placeholder="0"
                            inputMode="decimal"
                          />
                        </Field>

                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-5 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal]">
                            <p className="text-[#62748e]">
                              {isDepositEnabled ? "Valor de entrada" : "Valor do produto"}
                            </p>
                            <p className="shrink-0 text-[#414651]">
                              {formatCurrencyPreview(
                                isDepositEnabled
                                  ? clampedDepositAmount
                                  : paymentPreviewProductAmount
                              )}
                            </p>
                          </div>
                          {isDepositEnabled ? (
                            <div className="flex items-start justify-between gap-5 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal]">
                              <p className="text-[#62748e]">Valor restante do produto</p>
                              <p className="shrink-0 text-[#414651]">
                                {formatCurrencyPreview(remainingPaymentAmount)}
                              </p>
                            </div>
                          ) : null}
                          <div className="flex items-start justify-between gap-5 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal]">
                            <p className="text-[#62748e]">Valor do acréscimo online</p>
                            <p className="shrink-0 text-[#414651]">
                              {formatCurrencyPreview(onlineSurchargeAmount)} (
                              {onlineSurchargePercent.trim() || "0%"})
                            </p>
                          </div>
                          <div className="h-px border-t border-dashed border-[#e5e7eb]" />
                          <div className="flex items-center justify-between gap-5 font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-[normal] text-[#0f172b]">
                            <p>Valor total</p>
                            <p className="font-['Helvetica_Neue:Medium',sans-serif] text-base">
                              {formatCurrencyPreview(paymentPreviewTotalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="participant"
                title="Participante e termos"
                description="Exigências de participação, ficha do participante e termo de responsabilidade."
              >
                <div className="flex flex-col gap-3">
                  <SectionLabel>Exigências de participação</SectionLabel>
                  <div className="flex flex-col gap-5">
                    <ToggleLine
                      title="Habilitar limite de idade"
                      description="Defina a idade mínima e máxima para participar. Desabilitado, o produto irá aceitar todas as idades."
                      checked={isAgeLimitEnabled}
                      onCheckedChange={setIsAgeLimitEnabled}
                    />
                    {isAgeLimitEnabled ? (
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Idade mínima">
                          <input
                            className={inputClass}
                            inputMode="numeric"
                            maxLength={3}
                            pattern="[0-9]*"
                            placeholder="10"
                            value={minimumAge}
                            onChange={(event) => setMinimumAge(onlyDigits(event.target.value))}
                          />
                        </Field>
                        <Field label="Idade máxima">
                          <input
                            className={inputClass}
                            inputMode="numeric"
                            maxLength={3}
                            pattern="[0-9]*"
                            placeholder="65"
                            value={maximumAge}
                            onChange={(event) => setMaximumAge(onlyDigits(event.target.value))}
                          />
                        </Field>
                      </div>
                    ) : null}
                    <div className="flex flex-col gap-[10px]">
                      <p className="font-['Helvetica_Neue:Regular',sans-serif] text-[13px] leading-[normal] text-[#1f2937]">
                        Nível de esforço
                      </p>
                      <div
                        role="tablist"
                        aria-label="Nível de esforço"
                        className="grid w-full grid-cols-2 gap-1 rounded-full border border-[#f5f5f5] bg-[#fafafa] p-1 md:h-12 md:grid-cols-4"
                      >
                        {productEffortLevelOptions.map((option) => {
                          const active = productEffortLevel === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setProductEffortLevel(option.value)}
                              className={`flex h-10 min-w-0 items-center justify-center rounded-full px-3 text-sm leading-none whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none md:h-full ${
                                active
                                  ? "bg-white font-['Helvetica_Neue:Medium',sans-serif] text-[#414651] shadow-[inset_0px_0px_2px_0px_rgba(0,0,0,0.15)]"
                                  : "font-['Helvetica_Neue:Regular',sans-serif] text-[#414651] hover:bg-white/70"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <SectionLabel>Ficha do participante</SectionLabel>
                  <div className="flex flex-col gap-4">
                    <ToggleLine
                      title="Exigir ficha de dados"
                      description="O participante preenche a ficha com dados que podem ser relevantes para o passeio durante a compra."
                      checked={isParticipantDataSheetEnabled}
                      onCheckedChange={setIsParticipantDataSheetEnabled}
                    />
                    {isParticipantDataSheetEnabled ? (
                      <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {participantDataFormOptions.map((option) => (
                            <CategoryButton
                              key={option.id}
                              icon={option.icon}
                              title={option.title}
                              description={option.description}
                              active={participantDataFormMode === option.id}
                              compact
                              onClick={() => setParticipantDataFormMode(option.id)}
                            />
                          ))}
                        </div>
                        {participantDataFormMode === "complete" ? (
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {participantDataFieldOptions.map((option) => {
                              const selected = participantDataFields.has(option.id);

                              return (
                                <ParticipantDataFieldButton
                                  key={option.id}
                                  icon={option.icon}
                                  iconNode={option.iconNode}
                                  label={option.label}
                                  selected={selected}
                                  onClick={() =>
                                    setParticipantDataFields((current) => {
                                      const next = new Set(current);
                                      if (next.has(option.id)) next.delete(option.id);
                                      else next.add(option.id);
                                      return next;
                                    })
                                  }
                                />
                              );
                            })}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <SectionLabel>Termos e políticas da empresa</SectionLabel>
                  <ResponsibilityTermsSection
                    title={responsibilityTermTitle}
                    text={responsibilityTermText}
                    onTitleChange={setResponsibilityTermTitle}
                    onTextChange={setResponsibilityTermText}
                  />
                </div>
              </SectionCard>

              <SectionCard
                id="communication"
                title="Comunicação"
                description="Avisos automáticos para o cliente antes e depois da experiência."
              >
                <CommunicationTemplateEditor
                  title="Habilitar envio de e-mail"
                  description="Ideal para detalhes completos: local, horário, o que levar, etc."
                  channelLabel="Habilitar envio de e-mail"
                  checked={communicationChannels.has("E-mail")}
                  onCheckedChange={(checked) => updateCommunicationChannel("E-mail", checked)}
                  templateLabel="Template de e-mail"
                  templateValue={emailTemplate}
                  templateOptions={emailTemplateOptions}
                  onTemplateValueChange={setEmailTemplate}
                  text={preEventMessage}
                  onTextChange={setPreEventMessage}
                  fullToolbar
                />

                <CommunicationTemplateEditor
                  title="Habilitar envio de mensagem via WhatsApp"
                  description="Ideal para detalhes completos: local, horário, o que levar, etc."
                  channelLabel="Habilitar envio de mensagem via WhatsApp"
                  checked={communicationChannels.has("WhatsApp")}
                  onCheckedChange={(checked) => updateCommunicationChannel("WhatsApp", checked)}
                  templateLabel="Template de mensagem"
                  templateValue={whatsappTemplate}
                  templateOptions={whatsappTemplateOptions}
                  onTemplateValueChange={setWhatsappTemplate}
                  text={voucherInstructions}
                  onTextChange={setVoucherInstructions}
                />
              </SectionCard>

              <SectionCard
                id="settings"
                title="Configurações avançadas"
                description="Canais de venda, loja online e visibilidade do produto."
              >
                <div className="flex flex-col gap-[10px]">
                  <SectionLabel>URL do produto</SectionLabel>
                  <div className="focus-within:border-primary focus-within:ring-primary/20 flex min-h-10 overflow-hidden rounded-[8px] border border-[#cbd5e1] bg-white focus-within:ring-3">
                    <div className="flex shrink-0 items-center border-r border-[#cbd5e1] bg-[#f5f5f5] px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] opacity-50">
                      {productPublicUrlPrefix}
                    </div>
                    <input
                      className="min-w-0 flex-1 bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651] outline-none placeholder:text-slate-400"
                      aria-label="Slug da URL do produto"
                      value={productUrlSlug}
                      placeholder={defaultProductUrlSlug}
                      onChange={(event) => {
                        clearProductPublicUrlCopiedTimeout();
                        setProductUrlSlug(createProductUrlSlug(event.target.value));
                        setIsProductUrlSlugManuallyEdited(true);
                        setIsProductPublicUrlCopied(false);
                      }}
                    />
                    <button
                      type="button"
                      onClick={copyProductPublicUrl}
                      className="flex shrink-0 items-center px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0b5ed7] transition-colors focus-visible:ring-3 focus-visible:ring-[#1570ef]/20 focus-visible:outline-none"
                    >
                      <span className="flex items-center gap-1.5 rounded-[6px] px-1 py-1 transition-colors hover:bg-[#eff6ff]">
                        {isProductPublicUrlCopied ? "Link copiado" : "Copiar link"}
                        <HugeiconsIcon
                          icon={Copy02Icon}
                          size={16}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <SectionLabel>Canais de venda</SectionLabel>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {salesChannelOptions.map((option) => (
                      <CategoryButton
                        key={option.id}
                        icon={option.icon}
                        title={option.title}
                        description={option.description}
                        compact
                        compactHeight="short"
                        active={salesChannels.has(option.id)}
                        onClick={() => {
                          setSalesChannels((current) => {
                            const next = new Set(current);
                            if (next.has(option.id)) {
                              next.delete(option.id);
                            } else {
                              next.add(option.id);
                            }
                            return next;
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <SectionLabel>Destaque na loja</SectionLabel>
                  <ToggleLine
                    title="Destacar produto na vitrine"
                    description="O produto ganha a primeira posição na seção de destaques da loja."
                    checked={isStorefrontFeatured}
                    onCheckedChange={setIsStorefrontFeatured}
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <SectionLabel>Produtos de sugestão / semelhantes</SectionLabel>
                  <div className="flex flex-col gap-1.5">
                    <Popover
                      open={isSuggestedProductsOpen}
                      onOpenChange={setIsSuggestedProductsOpen}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          aria-expanded={isSuggestedProductsOpen}
                          aria-label="Selecionar produtos sugeridos"
                          className="focus-visible:ring-primary/20 flex h-10 w-full items-center justify-between rounded-[8px] border border-[#cbd5e1] bg-white px-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#717680] transition-colors hover:bg-[#f8fafc] focus-visible:ring-3"
                        >
                          <span className="min-w-0 truncate">
                            {suggestedProductsSelectionLabel}
                          </span>
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={20}
                            strokeWidth={1.5}
                            aria-hidden="true"
                            className={`shrink-0 text-[#717680] transition-transform ${
                              isSuggestedProductsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        side="bottom"
                        sideOffset={4}
                        className="z-[60] w-[var(--radix-popover-trigger-width)] rounded-[8px] border border-[#e9eaeb] bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                        onOpenAutoFocus={(event) => event.preventDefault()}
                      >
                        <div
                          role="listbox"
                          aria-label="Produtos cadastrados"
                          aria-multiselectable="true"
                          className="flex max-h-[220px] flex-col overflow-y-auto"
                        >
                          {suggestedProductOptions.map((option) => {
                            const isSelected = selectedSuggestedProductNames.includes(option.name);

                            return (
                              <button
                                key={option.name}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => toggleSuggestedProduct(option.name)}
                                className="flex min-h-10 w-full items-center gap-2 rounded-[6px] px-3 py-2 text-left transition-colors hover:bg-[#f8fafc] focus:bg-[#f8fafc] focus:outline-none"
                              >
                                <span
                                  className={`grid size-4 shrink-0 place-items-center rounded-[4px] border ${
                                    isSelected
                                      ? "border-[#0b5ed7] bg-[#0b5ed7] text-white"
                                      : "border-[#d0d5dd] bg-white text-transparent"
                                  }`}
                                >
                                  <HugeiconsIcon
                                    icon={CheckmarkCircle02Icon}
                                    size={12}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]">
                                    {option.name}
                                  </span>
                                  <span className="mt-0.5 block truncate font-['Helvetica_Neue:Regular',sans-serif] text-xs text-[#717680]">
                                    {option.type}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <p className="font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[normal] text-[#64748b]">
                      Referente a produtos que aparecerão como sugestões adicionais de compra na
                      página do produto
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSuggestedProductNames.map((name) => (
                      <span
                        key={name}
                        className="flex items-center gap-1.5 rounded-full border border-[#dbeafe] bg-[#e8f0fe] px-2.5 py-1 font-['Helvetica_Neue:Regular',sans-serif] text-xs leading-[18px] text-[#0b5ed7]"
                      >
                        {name}
                        <button
                          type="button"
                          aria-label={`Remover sugestão ${name}`}
                          onClick={() => removeSuggestedProduct(name)}
                          className="flex size-3 items-center justify-center"
                        >
                          <HugeiconsIcon
                            icon={Cancel01Icon}
                            size={12}
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-5">
                    <SectionLabel className="flex-1">Configurações de SEO</SectionLabel>
                    <button
                      type="button"
                      className="flex shrink-0 items-center gap-2 rounded-[6px] font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#0b5ed7] transition-colors hover:text-[#084fb7]"
                    >
                      <HugeiconsIcon
                        icon={ArtificialIntelligence08Icon}
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      Gerar conteúdo com IA
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Field label="Título da página">
                      <input
                        className={inputClass}
                        placeholder="Ex.: Trilha Pico do Itacolomi | Retrilhar"
                        value={seoPageTitle}
                        onChange={(event) => setSeoPageTitle(event.target.value)}
                      />
                    </Field>
                    <Field label="Meta descrição">
                      <textarea
                        className="text-foreground focus:border-primary focus:ring-primary/20 min-h-20 w-full rounded-[12px] border border-[#e4e4e7] bg-white px-4 py-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors outline-none placeholder:text-[#717680] focus:ring-3"
                        placeholder="Ex.: Trilha guiada de 4 horas até o Pico do Itacolomi, com condutor de aventura, equipamentos de segurança e seguro incluso."
                        value={seoMetaDescription}
                        onChange={(event) => setSeoMetaDescription(event.target.value)}
                      />
                    </Field>
                    <ToggleLine
                      title="Habilitar código JavaScript personalizado"
                      description="Adicione scripts de rastreamento, como Google Tag Manager ou Meta Pixel, ou personalizações próprias. O código roda na página pública deste produto, para todos os visitantes."
                      checked={isCustomJavascriptEnabled}
                      onCheckedChange={setIsCustomJavascriptEnabled}
                    />
                    {isCustomJavascriptEnabled ? (
                      <textarea
                        className="text-foreground focus:border-primary focus:ring-primary/20 min-h-20 w-full rounded-[12px] border border-[#e4e4e7] bg-white px-4 py-3 font-['Helvetica_Neue:Regular',sans-serif] text-sm transition-colors outline-none placeholder:text-[#717680] focus:ring-3"
                        aria-label="Código JavaScript personalizado"
                        placeholder="Cole o código aqui, incluindo as tags <script>. Exemplo: o snippet de instalação do GTM ou do Meta Pixel."
                        value={customJavascript}
                        onChange={(event) => setCustomJavascript(event.target.value)}
                      />
                    ) : null}
                  </div>
                </div>
              </SectionCard>

              {formError ? (
                <p className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm">
                  {formError}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 pb-8">
                <button
                  type="button"
                  onClick={requestClose}
                  className="h-9 rounded-lg border border-[#e9eaeb] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm text-[#414651]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground h-9 rounded-lg px-4 font-['Helvetica_Neue:Medium',sans-serif] text-sm"
                >
                  Publicar produto
                </button>
              </div>
            </div>

            <ReadinessSidebar
              productName={form.nome}
              summary={productSummary}
              readiness={readiness}
              onActivateSection={activateStep}
            />
          </div>
        </main>
      </div>

      <Dialog
        open={isExitConfirmationOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsExitConfirmationOpen(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="gap-0 rounded-2xl border border-[#e9eaeb] bg-white p-0 shadow-xl sm:max-w-[500px]"
        >
          <DialogHeader className="gap-2 px-6 pt-6 pb-5">
            <DialogTitle className="font-['Helvetica_Neue:Medium',sans-serif] text-base leading-6 text-[#181d27]">
              Sair sem salvar rascunho?
            </DialogTitle>
            <DialogDescription className="font-['Helvetica_Neue:Regular',sans-serif] text-sm leading-5 text-[#535862]">
              Você preencheu informações deste produto. Deseja prosseguir sem salvar ou salvar o
              rascunho antes de sair?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="border-t border-[#e9eaeb] px-6 py-4">
            <button
              type="button"
              onClick={() => setIsExitConfirmationOpen(false)}
              className="h-10 rounded-[10px] border border-[#e2e8f0] bg-white px-4 font-['Helvetica_Neue:Regular',sans-serif] text-sm whitespace-nowrap text-[#252b37] transition-colors hover:bg-[#f8fafc]"
            >
              Continuar editando
            </button>
            <button
              type="button"
              onClick={closeWithoutSaving}
              className="h-10 rounded-[10px] bg-[#F04438] px-5 font-['Helvetica_Neue:Medium',sans-serif] text-sm whitespace-nowrap text-white transition-colors hover:bg-[#d92d20]"
            >
              Sair sem salvar
            </button>
            <button
              type="button"
              onClick={saveDraftAndClose}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-[10px] px-5 font-['Helvetica_Neue:Medium',sans-serif] text-sm whitespace-nowrap transition-colors"
            >
              Salvar e sair
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ProductHistoryDrawer open={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
      <VariablePricingRuleDrawer
        open={activeVariablePricingRule !== null}
        rule={activeVariablePricingRule}
        onOpenChange={(open) => {
          if (!open) {
            setActiveVariablePricingRuleIndex(null);
          }
        }}
        onSave={(rule) => {
          if (activeVariablePricingRuleIndex === null) return;

          setVariablePricingRules((currentRules) =>
            currentRules.map((currentRule, index) =>
              index === activeVariablePricingRuleIndex ? rule : currentRule
            )
          );
        }}
      />
      <ProductPeriodConfigDrawer
        open={activeProductPeriodConfig !== null}
        config={activeProductPeriodConfig ?? emptyProductPeriodConfig}
        onOpenChange={(open) => {
          if (!open) {
            setActiveProductPeriodConfigIndex(null);
          }
        }}
        onSave={(config) => {
          if (activeProductPeriodConfigIndex === null) return;

          setProductPeriodConfigs((currentConfigs) =>
            currentConfigs.map((currentConfig, index) =>
              index === activeProductPeriodConfigIndex ? config : currentConfig
            )
          );
        }}
      />
      <ScheduleRemovalDialog
        open={pendingProductPeriodRemovalIndex !== null}
        title="Remover período?"
        onConfirm={confirmProductPeriodRemoval}
        onOpenChange={(open) => {
          if (!open) {
            setPendingProductPeriodRemovalIndex(null);
          }
        }}
      />
      <ScheduleRemovalDialog
        open={pendingVariablePricingRuleRemovalIndex !== null}
        title="Remover regra?"
        onConfirm={confirmVariablePricingRuleRemoval}
        onOpenChange={(open) => {
          if (!open) {
            setPendingVariablePricingRuleRemovalIndex(null);
          }
        }}
      />
      <RouteDayConfigDrawer
        open={activeRouteDayConfig !== null}
        title={`Dia ${(activeRouteDayConfigIndex ?? 0) + 1}`}
        config={activeRouteDayConfig ?? emptyRouteDayConfig}
        onOpenChange={(open) => {
          if (!open) {
            setActiveRouteDayConfigIndex(null);
          }
        }}
        onSave={(config) => {
          if (activeRouteDayConfigIndex === null) return;

          setRouteDayConfigs((currentConfigs) =>
            currentConfigs.map((currentConfig, index) =>
              index === activeRouteDayConfigIndex ? config : currentConfig
            )
          );
        }}
      />
      <ScheduleRemovalDialog
        open={pendingRouteDayRemovalIndex !== null}
        title="Remover roteiro?"
        onConfirm={confirmRouteDayRemoval}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRouteDayRemovalIndex(null);
          }
        }}
      />
      <ScheduleRemovalDialog
        open={pendingItemRemovalIndex !== null}
        title="Remover item?"
        onConfirm={confirmItemRemoval}
        onOpenChange={(open) => {
          if (!open) {
            setPendingItemRemovalIndex(null);
          }
        }}
      />
      <ItemConfigDrawer
        open={activeItemConfig !== null}
        config={activeItemConfig ?? emptyItemConfig}
        onOpenChange={(open) => {
          if (!open) {
            setActiveItemConfigIndex(null);
          }
        }}
        onSave={(config) => {
          if (activeItemConfigIndex === null) return;

          setItemConfigs((currentConfigs) =>
            currentConfigs.map((currentConfig, index) =>
              index === activeItemConfigIndex ? config : currentConfig
            )
          );
        }}
      />
    </form>
  );
}
