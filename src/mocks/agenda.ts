/**
 * Central mock dataset for the Agenda module.
 *
 * Source of truth: Figma file "Retrilhar - Admin" (key: HDCHTF7DCaSZwknQoLHVPQ)
 * Frames inspected via Figma MCP:
 *   - AGENDA - MÊS          (14948:75262)
 *   - AGENDA - ATIVIDADES DO DIA (15231:80154)
 *   - AGENDA - PARTICIPANTES (15229:62356)
 *   - AGENDA - VISÃO GERAL  (15221:23601)
 *
 * Rules:
 * - Deterministic: no Math.random() — IDs are sequential, dates are absolute.
 * - All names are Brazilian-Portuguese (matching the Figma design exactly).
 * - Today = 2026-05-11 (fixed reference for the usability test).
 * - Do NOT import this file in production code paths.
 */

import type {
  Activity,
  BulkAction,
  BulkActionResult,
  Reservation,
  ReservationStateMachine,
} from '../types/agenda';

// ─────────────────────────────────────────────────────────────────────────────
// Shared boarding points
// ─────────────────────────────────────────────────────────────────────────────

// Boarding points — from Figma AGENDA - ATIVIDADES DO DIA frame
const BP_PRINCIPAL = 'Parque Municipal, Sabará - Belo Horizonte';
const BP_AUXILIAR  = 'Ponto Auxiliar — Terminal Rodoviário';
const BP_HOTEL     = 'Hotel Serra Verde';
const BP_POUSADA   = 'Pousada da Cachoeira';

// ─────────────────────────────────────────────────────────────────────────────
// Design system color tokens (Figma variables — collection "Variable collection")
// Brand palette extracted via Figma MCP
// ─────────────────────────────────────────────────────────────────────────────
// Brand/25  → #edf0ff   Brand/400 → #1b71fd
// Brand/50  → #d5dcfe   Brand/500 → #0b5ed7
// Brand/100 → #adbdfe   Brand/600 → #084fb7
// Brand/200 → #87a2fe   Brand/700 → #043b8c
// Brand/300 → #5e89fd   Brand/800 → #02255f
//                        Brand/900 → #011a48
//                        Brand/950 → #000f2f
//
// Activity status chip colors (from AGENDA - MÊS):
//   Confirmed (blue)  → bg:#eff6ff  dot:#2b7fff  text:#1447e6
//   Pending (orange)  → bg:#fff2d3  dot:#ff992b  text:#e0850f
//   Blocked (gray)    → bg:#fafafa  dot:#d5d7da  text:#919191
//   Full (red)        → bg:#fef2f2  dot:#fb2c36  text:#c10007
//   Holiday (purple)  → bg:#f3e8ff  text:#8200db

// ─────────────────────────────────────────────────────────────────────────────
// 1. mockActivities
//
// Distribution:
//   - Today (2026-05-11): 4 activities → triggers "+N" overflow in the calendar
//     • act-001  requiresInsurance: true,  status: pending    (linked to mockReservations)
//     • act-002  requiresInsurance: false, status: confirmed
//     • act-003  requiresInsurance: false, status: blocked
//     • act-004  requiresInsurance: false, status: full
//   - Multi-day (2026-05-14 → 2026-05-16): acts 005-007 (Expedição Mantiqueira)
//   - Past activities: act-008 (2026-05-08), act-011 (2026-04-28 — adjacent month)
//   - Future activities: act-009 (2026-05-20), act-010 (2026-05-22), act-012 (2026-06-05)
// ─────────────────────────────────────────────────────────────────────────────

export const mockActivities: Activity[] = [
  // ── Today (2026-05-11) — 4 activities to trigger "+N" overflow ───────────
  // Names match Figma frames AGENDA - ATIVIDADES DO DIA and AGENDA - VISÃO GERAL

  {
    id: 'act-001',
    // Primary activity — linked to mockReservations. requiresInsurance: true.
    // Figma: AGENDA - VISÃO GERAL (15221:23601) — "Trilha Pico do Itacolomi"
    // location: "Parque Municipal, Sabará - Belo Horizonte"
    // occupancy shown as "08/12" (85% ocupado), guide: João Silva (Guia Líder)
    name: 'Trilha Pico do Itacolomi',
    date: '2026-05-11',
    startTime: '08:00',
    endTime: '11:00',
    capacity: 12,
    occupancy: 8,
    guideName: 'João Silva',
    status: 'pending',
    requiresInsurance: true,
  },
  {
    id: 'act-002',
    // Figma: AGENDA - ATIVIDADES DO DIA (15231:80154) — "Rapel Cachoeira Alta"
    // status "Atividade Não Iniciada", (8/8) — full capacity
    name: 'Rapel Cachoeira Alta',
    date: '2026-05-11',
    startTime: '09:00',
    endTime: '12:00',
    capacity: 8,
    occupancy: 8,
    guideName: 'Maria Costa',
    status: 'full',
    requiresInsurance: false,
  },
  {
    id: 'act-003',
    // Figma: AGENDA - ATIVIDADES DO DIA — "Bike Tour Vale Verde"
    // status "Atividade Cancelada" (8/12)
    name: 'Bike Tour Vale Verde',
    date: '2026-05-11',
    startTime: '13:30',
    endTime: '17:00',
    capacity: 12,
    occupancy: 8,
    guideName: '',
    status: 'blocked',
    requiresInsurance: false,
  },
  {
    id: 'act-004',
    // Figma: AGENDA - ATIVIDADES DO DIA — "Escalada Morro Alto"
    // location: "Parque Municipal, Sabará - Belo Horizonte", (8/12)
    name: 'Escalada Morro Alto',
    date: '2026-05-11',
    startTime: '15:00',
    endTime: '18:00',
    capacity: 12,
    occupancy: 8,
    guideName: 'Pedro Santos',
    status: 'confirmed',
    requiresInsurance: false,
  },

  // ── Multi-day: Trilha Pico do Itambé (3 days) ────────────────────────────
  // Figma: AGENDA - ATIVIDADES DO DIA — "Atividade multi-dias"
  // "23/03/2026 - 28/03/2026 (5 dias)" / "(Dia 3 de 5)"

  {
    id: 'act-005',
    name: 'Trilha Pico do Itambé',
    date: '2026-05-14',
    startTime: '07:00',
    endTime: '18:00',
    capacity: 10,
    occupancy: 7,
    guideName: 'Carlos Vidal',
    status: 'confirmed',
    requiresInsurance: true,
    dayNumber: 1,
    totalDays: 3,
  },
  {
    id: 'act-006',
    name: 'Trilha Pico do Itambé',
    date: '2026-05-15',
    startTime: '07:00',
    endTime: '18:00',
    capacity: 10,
    occupancy: 7,
    guideName: 'Carlos Vidal',
    status: 'confirmed',
    requiresInsurance: true,
    dayNumber: 2,
    totalDays: 3,
  },
  {
    id: 'act-007',
    name: 'Trilha Pico do Itambé',
    date: '2026-05-16',
    startTime: '07:00',
    endTime: '16:00',
    capacity: 10,
    occupancy: 7,
    guideName: 'Carlos Vidal',
    status: 'confirmed',
    requiresInsurance: true,
    dayNumber: 3,
    totalDays: 3,
  },

  // ── Other days this month ─────────────────────────────────────────────────

  {
    id: 'act-008',
    name: 'Travessia Vale do Pati',
    date: '2026-05-08',
    startTime: '06:30',
    endTime: '17:00',
    capacity: 12,
    occupancy: 9,
    guideName: 'Sônia Brandão',
    status: 'confirmed',
    requiresInsurance: false,
  },
  {
    id: 'act-009',
    name: 'Bike Trail Inhotim',
    date: '2026-05-20',
    startTime: '08:00',
    endTime: '14:00',
    capacity: 16,
    occupancy: 5,
    guideName: 'Pedro Henrique Lima',
    status: 'pending',
    requiresInsurance: false,
  },
  {
    id: 'act-010',
    name: 'Rapel Cachoeira das Pedras',
    date: '2026-05-22',
    startTime: '09:30',
    endTime: '13:00',
    capacity: 10,
    occupancy: 10,
    guideName: 'Mônica Duarte',
    status: 'full',
    requiresInsurance: false,
  },

  // ── Adjacent months ───────────────────────────────────────────────────────

  {
    id: 'act-011',
    name: 'Trilha Serra do Mar',
    date: '2026-04-28',
    startTime: '07:00',
    endTime: '15:00',
    capacity: 20,
    occupancy: 15,
    guideName: 'Jorge Cavalcanti',
    status: 'confirmed',
    requiresInsurance: false,
  },
  {
    id: 'act-012',
    name: 'Expedição Chapada Diamantina',
    date: '2026-06-05',
    startTime: '06:00',
    endTime: '20:00',
    capacity: 14,
    occupancy: 3,
    guideName: 'Roberta Nogueira',
    status: 'pending',
    requiresInsurance: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. mockReservations
//
// Linked to act-001 — "Trilha Pico do Itacolomi" on 2026-05-11
// (requiresInsurance: true → all confirmed/checked-in reservations carry
//  insuranceStatus 'Contracted' or 'Required')
//
// Distribution (30 total):
//   Confirmed        18 (~60%) — 8 with Contracted, 10 with Required
//   AwaitingPayment   5 (~17%)
//   CheckedIn         5 (~17%)
//   Cancelled         1 (~3%)
//   NoShow            1 (~3%)
// ─────────────────────────────────────────────────────────────────────────────

export const mockReservations: Reservation[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // CONFIRMED — insurance Contracted (8)
  // Names sourced from Figma AGENDA - PARTICIPANTES (15229:62356):
  //   João Silva (#8821, Adulto, Comprador)
  //   Luciana Miranda (Cortesia)
  //   Manuela Louise Malu Bernardes (Infantil)
  //   Eduardo Lucca Victor Santos (Infantil)
  //   Vera Gabriela da Mota (#8821, Adulto, Comprador)
  //   Samuel Isaac Roberto Araújo (#8821, Adulto, Comprador)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'res-001',
    orderId: '#RE-9920',
    type: 'group',
    buyerName: 'João Silva',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-15T10:23:00',
    participants: [
      {
        id: 'part-001',
        name: 'João Silva',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
        notes: 'Comprador',
      },
      {
        id: 'part-002',
        name: 'Luciana Miranda',
        tariffType: 'Cortesia',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-003',
        name: 'Manuela Louise Malu Bernardes',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: true,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-004',
        name: 'Eduardo Lucca Victor Santos',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: true,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-002',
    orderId: '#RE-9921',
    type: 'individual',
    buyerName: 'Vera Gabriela da Mota',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-16T14:30:00',
    participants: [
      {
        id: 'part-005',
        name: 'Vera Gabriela da Mota',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
        notes: 'Comprador',
      },
    ],
  },

  {
    id: 'res-003',
    orderId: '#RE-9922',
    type: 'individual',
    buyerName: 'Samuel Isaac Roberto Araújo',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-18T09:15:00',
    participants: [
      {
        id: 'part-006',
        name: 'Samuel Isaac Roberto Araújo',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
        notes: 'Comprador',
      },
    ],
  },

  {
    id: 'res-004',
    orderId: '#RE-0004',
    type: 'group',
    buyerName: 'Rodrigo Oliveira Costa',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-20T11:45:00',
    participants: [
      {
        id: 'part-005',
        name: 'Rodrigo Oliveira Costa',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-006',
        name: 'Laura Beatriz Costa',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: true,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
        notes: 'Hipertensão controlada',
      },
      {
        id: 'part-007',
        name: 'Miguel Costa',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: true,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-005',
    orderId: '#RE-0005',
    type: 'individual',
    buyerName: 'Fernanda Alves Pereira',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-22T16:00:00',
    participants: [
      {
        id: 'part-008',
        name: 'Fernanda Alves Pereira',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_AUXILIAR,
      },
    ],
  },

  {
    id: 'res-006',
    orderId: '#RE-0006',
    type: 'group',
    buyerName: 'Marcelo Souza Barbosa',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-25T08:30:00',
    participants: [
      {
        id: 'part-009',
        name: 'Marcelo Souza Barbosa',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
      {
        id: 'part-010',
        name: 'Renata Aparecida Barbosa',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
    ],
  },

  {
    id: 'res-007',
    orderId: '#RE-0007',
    type: 'individual',
    buyerName: 'Juliana Carvalho Nunes',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-28T13:20:00',
    participants: [
      {
        id: 'part-011',
        name: 'Juliana Carvalho Nunes',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-008',
    orderId: '#RE-0008',
    type: 'group',
    buyerName: 'Thiago Rocha Martins',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-05-01T10:00:00',
    participants: [
      {
        id: 'part-012',
        name: 'Thiago Rocha Martins',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
      {
        id: 'part-013',
        name: 'Amanda Rocha Martins',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
      {
        id: 'part-014',
        name: 'Gustavo Rocha Martins',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: false,
        isMinor: false,
        boardingPoint: BP_POUSADA,
        notes: 'Não autorizou uso de imagem',
      },
      {
        id: 'part-015',
        name: 'Pedro Martins Jr.',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: true,
        boardingPoint: BP_POUSADA,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CONFIRMED — insurance Required / not contracted (10)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'res-009',
    orderId: '#RE-0009',
    type: 'individual',
    buyerName: 'Camila Ribeiro Gomes',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-04-17T15:30:00',
    participants: [
      {
        id: 'part-016',
        name: 'Camila Ribeiro Gomes',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-010',
    orderId: '#RE-0010',
    type: 'group',
    buyerName: 'Leonardo Dias Cardoso',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-04-19T09:00:00',
    participants: [
      {
        id: 'part-017',
        name: 'Leonardo Dias Cardoso',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
      {
        id: 'part-018',
        name: 'Mariana Dias Cardoso',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
    ],
  },

  {
    id: 'res-011',
    orderId: '#RE-0011',
    type: 'individual',
    buyerName: 'Patrícia Nascimento Vieira',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-04-21T14:00:00',
    participants: [
      {
        id: 'part-019',
        name: 'Patrícia Nascimento Vieira',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_AUXILIAR,
      },
    ],
  },

  {
    id: 'res-012',
    orderId: '#RE-0012',
    type: 'group',
    buyerName: 'Rafael Cunha Monteiro',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-04-23T10:30:00',
    participants: [
      {
        id: 'part-020',
        name: 'Rafael Cunha Monteiro',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-021',
        name: 'Fernanda Cunha Monteiro',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-022',
        name: 'João Victor Monteiro',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-013',
    orderId: '#RE-0013',
    type: 'individual',
    buyerName: 'Larissa Teixeira Melo',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-04-26T11:00:00',
    participants: [
      {
        id: 'part-023',
        name: 'Larissa Teixeira Melo',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
    ],
  },

  {
    id: 'res-014',
    orderId: '#RE-0014',
    type: 'group',
    buyerName: 'Diego Pinto Santos',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-04-29T08:15:00',
    participants: [
      {
        id: 'part-024',
        name: 'Diego Pinto Santos',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-025',
        name: 'Carla Pinto Santos',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: true,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
        notes: 'Asma leve — carrega bombinha',
      },
      {
        id: 'part-026',
        name: 'Eduarda Pinto Santos',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-027',
        name: 'Vitor Santos Jr.',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: true,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-028',
        name: 'Alice Santos',
        tariffType: 'Cortesia',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-015',
    orderId: '#RE-0015',
    type: 'individual',
    buyerName: 'Mariana Correia Freitas',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-05-02T16:30:00',
    participants: [
      {
        id: 'part-029',
        name: 'Mariana Correia Freitas',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
    ],
  },

  {
    id: 'res-016',
    orderId: '#RE-0016',
    type: 'group',
    buyerName: 'Felipe Araújo Lima',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-05-04T09:45:00',
    participants: [
      {
        id: 'part-030',
        name: 'Felipe Araújo Lima',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_AUXILIAR,
      },
      {
        id: 'part-031',
        name: 'Giovanna Araújo Lima',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_AUXILIAR,
      },
    ],
  },

  {
    id: 'res-017',
    orderId: '#RE-0017',
    type: 'individual',
    buyerName: 'Isabela Moreira Costa',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-05-06T13:00:00',
    participants: [
      {
        id: 'part-032',
        name: 'Isabela Moreira Costa',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-018',
    orderId: '#RE-0018',
    type: 'group',
    buyerName: 'Bruno Coelho Andrade',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    insuranceStatus: 'Required',
    createdAt: '2026-05-07T10:30:00',
    participants: [
      {
        id: 'part-033',
        name: 'Bruno Coelho Andrade',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
      {
        id: 'part-034',
        name: 'Luciana Coelho Andrade',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
      {
        id: 'part-035',
        name: 'Mateus Coelho Andrade',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: true,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
        notes: 'Joelho operado recentemente — ritmo mais lento',
      },
      {
        id: 'part-036',
        name: 'Clara Andrade',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: true,
        boardingPoint: BP_POUSADA,
      },
      {
        id: 'part-037',
        name: 'Sophia Andrade',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: false,
        isMinor: true,
        boardingPoint: BP_POUSADA,
        notes: 'Responsável não autorizou uso de imagem',
      },
      {
        id: 'part-038',
        name: 'Henrique Andrade Filho',
        tariffType: 'Cortesia',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AWAITING PAYMENT (5)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'res-019',
    orderId: '#RE-0019',
    type: 'individual',
    buyerName: 'Vanessa Lopes Ferreira',
    status: 'AwaitingPayment',
    paymentStatus: 'Pending',
    insuranceStatus: 'Required',
    createdAt: '2026-05-05T14:00:00',
    participants: [
      {
        id: 'part-039',
        name: 'Vanessa Lopes Ferreira',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-020',
    orderId: '#RE-0020',
    type: 'group',
    buyerName: 'Eduardo Macedo Ramos',
    status: 'AwaitingPayment',
    paymentStatus: 'Pending',
    insuranceStatus: 'Required',
    createdAt: '2026-05-06T09:30:00',
    participants: [
      {
        id: 'part-040',
        name: 'Eduardo Macedo Ramos',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
      {
        id: 'part-041',
        name: 'Cristina Macedo Ramos',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
    ],
  },

  {
    id: 'res-021',
    orderId: '#RE-0021',
    type: 'individual',
    buyerName: 'Sandra Borges Nascimento',
    status: 'AwaitingPayment',
    paymentStatus: 'Pending',
    insuranceStatus: 'Required',
    createdAt: '2026-05-07T11:15:00',
    participants: [
      {
        id: 'part-042',
        name: 'Sandra Borges Nascimento',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_AUXILIAR,
      },
    ],
  },

  {
    id: 'res-022',
    orderId: '#RE-0022',
    type: 'group',
    buyerName: 'André Figueiredo Santos',
    status: 'AwaitingPayment',
    paymentStatus: 'Pending',
    insuranceStatus: 'Required',
    createdAt: '2026-05-08T10:00:00',
    participants: [
      {
        id: 'part-043',
        name: 'André Figueiredo Santos',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-044',
        name: 'Marília Figueiredo Santos',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
      {
        id: 'part-045',
        name: 'Lucas Figueiredo Jr.',
        tariffType: 'Infantil',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: true,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-023',
    orderId: '#RE-0023',
    type: 'individual',
    buyerName: 'Priscila Moura Carvalho',
    status: 'AwaitingPayment',
    paymentStatus: 'Pending',
    insuranceStatus: 'Required',
    createdAt: '2026-05-09T15:30:00',
    participants: [
      {
        id: 'part-046',
        name: 'Priscila Moura Carvalho',
        tariffType: 'Adulto',
        checkInStatus: 'Pending',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CHECKED IN (5)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'res-024',
    orderId: '#RE-0024',
    type: 'individual',
    buyerName: 'Gabriel Henrique Silva',
    status: 'CheckedIn',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-14T10:00:00',
    participants: [
      {
        id: 'part-047',
        name: 'Gabriel Henrique Silva',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-025',
    orderId: '#RE-0025',
    type: 'group',
    buyerName: 'Tatiane Medeiros Rocha',
    status: 'CheckedIn',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-04-24T13:00:00',
    participants: [
      {
        id: 'part-048',
        name: 'Tatiane Medeiros Rocha',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
      {
        id: 'part-049',
        name: 'Paulo Medeiros Rocha',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_HOTEL,
      },
    ],
  },

  {
    id: 'res-026',
    orderId: '#RE-0026',
    type: 'individual',
    buyerName: 'Renato Campos Almeida',
    status: 'CheckedIn',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-05-03T09:00:00',
    participants: [
      {
        id: 'part-050',
        name: 'Renato Campos Almeida',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  {
    id: 'res-027',
    orderId: '#RE-0027',
    type: 'group',
    buyerName: 'Cláudia Silveira Guimarães',
    status: 'CheckedIn',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-05-05T11:30:00',
    participants: [
      {
        id: 'part-051',
        name: 'Cláudia Silveira Guimarães',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
      {
        id: 'part-052',
        name: 'Roberto Guimarães',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
      },
      {
        id: 'part-053',
        name: 'Lúcia Maria Guimarães',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: true,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_POUSADA,
        notes: 'Diabetes tipo 2 controlada — leva lanche',
      },
    ],
  },

  {
    id: 'res-028',
    orderId: '#RE-0028',
    type: 'individual',
    buyerName: 'Henrique Batista Costa',
    status: 'CheckedIn',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-05-08T14:00:00',
    participants: [
      {
        id: 'part-054',
        name: 'Henrique Batista Costa',
        tariffType: 'Adulto',
        checkInStatus: 'Done',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_AUXILIAR,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CANCELLED (1)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'res-029',
    orderId: '#RE-0029',
    type: 'individual',
    buyerName: 'Débora Vasconcelos Reis',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    insuranceStatus: 'Required',
    createdAt: '2026-04-30T10:00:00',
    participants: [
      {
        id: 'part-055',
        name: 'Débora Vasconcelos Reis',
        tariffType: 'Adulto',
        checkInStatus: 'Absent',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NO-SHOW (1)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 'res-030',
    orderId: '#RE-0030',
    type: 'individual',
    buyerName: 'Júlio César Azevedo',
    status: 'NoShow',
    paymentStatus: 'Paid',
    insuranceStatus: 'Contracted',
    createdAt: '2026-05-01T09:30:00',
    participants: [
      {
        id: 'part-056',
        name: 'Júlio César Azevedo',
        tariffType: 'Adulto',
        checkInStatus: 'Absent',
        hasHealthIssue: false,
        hasImageAuth: true,
        isMinor: false,
        boardingPoint: BP_PRINCIPAL,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. reservationStateMachine
//
// Maps each status to the list of statuses it can legally transition into.
// An empty array means the status is terminal.
// ─────────────────────────────────────────────────────────────────────────────

export const reservationStateMachine: ReservationStateMachine = {
  Draft:          ['AwaitingPayment', 'Confirmed', 'Expired'],
  AwaitingPayment: ['Confirmed', 'Cancelled'],
  Confirmed:      ['CheckedIn', 'Cancelled', 'AwaitingPayment'],
  CheckedIn:      ['Performed', 'Confirmed'],
  Performed:      ['Confirmed'],
  Cancelled:      [],
  NoShow:         [],
  Expired:        [],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. isEligibleForBulkAction
//
// Returns which of the provided reservations are eligible for a given action
// and which are not, along with a human-readable reason.
// ─────────────────────────────────────────────────────────────────────────────

type EligibilityRule = {
  test: (r: Reservation) => boolean;
  reason: string;
};

const ELIGIBILITY_RULES: Record<BulkAction, EligibilityRule> = {
  'check-in': {
    test: (r) => r.status === 'Confirmed',
    reason: 'Somente reservas com status Confirmada podem realizar check-in.',
  },
  'undo-check-in': {
    test: (r) => r.status === 'CheckedIn',
    reason: 'Somente reservas com check-in realizado podem desfazer o check-in.',
  },
  'confirm': {
    test: (r) => r.status === 'AwaitingPayment' || r.status === 'Draft',
    reason: 'Somente reservas aguardando pagamento ou em rascunho podem ser confirmadas.',
  },
  'undo-confirm': {
    test: (r) => r.status === 'Confirmed',
    reason: 'Somente reservas confirmadas podem ter a confirmação desfeita.',
  },
  'mark-performed': {
    test: (r) => r.status === 'CheckedIn',
    reason: 'Somente reservas com check-in realizado podem ser marcadas como realizadas.',
  },
  'add-insurance': {
    test: (r) =>
      (r.status === 'Confirmed' || r.status === 'CheckedIn') &&
      r.insuranceStatus !== 'Contracted',
    reason:
      'Somente reservas confirmadas ou com check-in realizado que ainda não possuem seguro contratado podem adicionar seguro.',
  },
  'resend-voucher': {
    test: (r) => r.status === 'Confirmed' || r.status === 'CheckedIn',
    reason:
      'Somente reservas confirmadas ou com check-in realizado podem ter o voucher reenviado.',
  },
  'reschedule': {
    test: (r) => r.status === 'Confirmed' || r.status === 'AwaitingPayment',
    reason: 'Somente reservas confirmadas ou aguardando pagamento podem ser reagendadas.',
  },
  'no-show': {
    test: (r) => r.status === 'Confirmed',
    reason: 'Somente reservas confirmadas podem ser marcadas como não comparecimento.',
  },
  'cancel': {
    test: (r) =>
      r.status !== 'Performed' &&
      r.status !== 'Cancelled' &&
      r.status !== 'NoShow' &&
      r.status !== 'Expired',
    reason:
      'Reservas realizadas, canceladas, não comparecimento ou expiradas não podem ser canceladas.',
  },
};

export function isEligibleForBulkAction(
  reservations: Reservation[],
  action: BulkAction,
): BulkActionResult {
  const rule = ELIGIBILITY_RULES[action];
  const eligible   = reservations.filter((r) => rule.test(r));
  const ineligible = reservations.filter((r) => !rule.test(r));
  return { eligible, ineligible, reason: rule.reason };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. mockDashboardStats
//
// Metric cards shown in AGENDA - MÊS (14948:75262) and AGENDA - ATUALIZAÇÕES.
// Values are identical across all Agenda frames — confirmed via Figma MCP.
// ─────────────────────────────────────────────────────────────────────────────

export const mockDashboardStats = {
  agendamentosHoje: {
    label: 'Agendamentos Hoje',
    subtitle: 'Reservas confirmadas',
    value: 23,
    trend: '+4 hoje',
    trendLabel: 'vs. período anterior',
  },
  agendamentosUltimaHora: {
    label: 'Agendamentos Última Hora',
    subtitle: 'Reservas recentes',
    value: 5,
    trend: '+2',
    trendLabel: 'vs. período anterior',
  },
  receitaEstimadaHoje: {
    label: 'Receita Estimada Hoje',
    subtitle: 'Total de vendas',
    value: 'R$ 4.250',
    trend: '+8.4%',
    trendLabel: 'vs. período anterior',
  },
  ocupacaoMedia: {
    label: 'Ocupação Média',
    subtitle: 'Percentual de ocupação',
    value: '85%',
    trend: '+12%',
    trendLabel: 'vs. mês anterior',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 6. mockGuides
//
// Guides shown in AGENDA - VISÃO GERAL (15221:23601) — "EQUIPE ESCALADA (3)".
// ─────────────────────────────────────────────────────────────────────────────

export interface Guide {
  id: string;
  name: string;
  initials: string;
  role: 'Guia Líder' | 'Guia de Apoio';
  status: 'available' | 'conflict';
  /** Only set when status === 'conflict' */
  conflictNote?: string;
  whatsapp?: string;
}

export const mockGuides: Guide[] = [
  {
    id: 'guide-001',
    name: 'João Silva',
    initials: 'JS',
    role: 'Guia Líder',
    status: 'available',
    whatsapp: '+5531900000001',
  },
  {
    id: 'guide-002',
    name: 'Maria Costa',
    initials: 'MC',
    role: 'Guia de Apoio',
    status: 'conflict',
    conflictNote: 'Já escalado em "Rapel Cachoeira Alta", das 09:00 às 12:00.',
    whatsapp: '+5531900000002',
  },
  {
    id: 'guide-003',
    name: 'Pedro Santos',
    initials: 'PS',
    role: 'Guia de Apoio',
    status: 'available',
    whatsapp: '+5531900000003',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. mockWeatherForecast
//
// Weather data shown in AGENDA - VISÃO GERAL (15221:23601) — "PREVISÃO CLIMÁTICA".
// ─────────────────────────────────────────────────────────────────────────────

export interface WeatherDay {
  dayLabel: string;
  dayNumber: number;
  high: number;
  low: number;
}

export const mockWeather = {
  current: {
    tempC: 26,
    feelsLikeC: 28,
    humidityPct: 65,
    windKmh: 18,
    rainChancePct: 20,
  },
  forecast: [
    { dayLabel: 'Seg', dayNumber: 12, high: 28, low: 18 },
    { dayLabel: 'Ter', dayNumber: 13, high: 26, low: 17 },
    { dayLabel: 'Qua', dayNumber: 14, high: 24, low: 16 },
    { dayLabel: 'Qui', dayNumber: 15, high: 29, low: 18 },
    { dayLabel: 'Sex', dayNumber: 16, high: 27, low: 18 },
    { dayLabel: 'Sáb', dayNumber: 17, high: 30, low: 20 },
    { dayLabel: 'Dom', dayNumber: 18, high: 28, low: 19 },
  ] as WeatherDay[],
  source: 'Dados de OpenWeather API',
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. mockActivityDetail
//
// Static detail for act-001 (Trilha Pico do Itacolomi) used in VISÃO GERAL tab.
// Extracted from Figma AGENDA - VISÃO GERAL (15221:23601).
// ─────────────────────────────────────────────────────────────────────────────

export const mockActivityDetail = {
  activityId: 'act-001',
  name: 'Trilha Pico do Itacolomi',
  location: 'Parque Municipal, Sabará - Belo Horizonte',
  dateTime: '2026-05-11T08:00:00',
  duration: '08:00 - 11:00 (3h)',
  reservations: {
    total: 12,
    occupied: 8,
    occupiedPct: 85,
    vacantPct: 15,
    byTariff: {
      adultos: 4,
      criancas: 3,
      cortesias: 1,
    },
  },
  guides: mockGuides,
  weather: mockWeather,
};
