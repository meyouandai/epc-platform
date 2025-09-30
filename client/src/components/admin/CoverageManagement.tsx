import React, { useState, useEffect } from 'react';

interface CountyData {
  id: string;
  name: string;
  assessorCount: number;
  districtCount: number;
  totalPostcodes: number;
  activePostcodes: number;
  districts: DistrictData[];
}

interface DistrictData {
  id: string;
  name: string;
  assessorCount: number;
  leadsLast30Days: number;
  leadsPrevious30Days: number;
  postcodes: PostcodeData[];
}

interface PostcodeData {
  code: string;
  assessorCount: number;
  leadsLast30Days: number;
  leadsPrevious30Days?: number;
}

interface CoverageManagementProps {
  token: string;
}

const CoverageManagement: React.FC<CoverageManagementProps> = ({ token }) => {
  const [counties, setCounties] = useState<CountyData[]>([]);
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set());
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'low' | 'gaps' | null>(null);

  useEffect(() => {
    fetchCoverageData();
  }, []);

  const fetchCoverageData = async () => {
    try {
      // Mock data for demo - replace with real API call
      const mockData: CountyData[] = [
        {
          id: 'london-central',
          name: 'London (Central)',
          assessorCount: 15,
          districtCount: 6,
          totalPostcodes: 80,
          activePostcodes: 24,
          districts: [
            {
              id: 'city-of-london',
              name: 'City of London',
              assessorCount: 1,
              leadsLast30Days: 89,
              leadsPrevious30Days: 76,
              postcodes: [
                { code: 'EC1A', assessorCount: 1, leadsLast30Days: 12, leadsPrevious30Days: 8 },
                { code: 'EC1M', assessorCount: 0, leadsLast30Days: 8, leadsPrevious30Days: 6 },
                { code: 'EC1N', assessorCount: 0, leadsLast30Days: 3, leadsPrevious30Days: 5 },
                { code: 'EC1R', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 4 },
                { code: 'EC1V', assessorCount: 0, leadsLast30Days: 7, leadsPrevious30Days: 9 },
                { code: 'EC1Y', assessorCount: 0, leadsLast30Days: 2, leadsPrevious30Days: 2 },
                { code: 'EC2A', assessorCount: 0, leadsLast30Days: 9, leadsPrevious30Days: 8 },
                { code: 'EC2M', assessorCount: 0, leadsLast30Days: 4, leadsPrevious30Days: 6 },
                { code: 'EC2N', assessorCount: 0, leadsLast30Days: 6, leadsPrevious30Days: 5 },
                { code: 'EC2R', assessorCount: 0, leadsLast30Days: 3, leadsPrevious30Days: 4 },
                { code: 'EC2V', assessorCount: 0, leadsLast30Days: 1, leadsPrevious30Days: 2 },
                { code: 'EC2Y', assessorCount: 0, leadsLast30Days: 8, leadsPrevious30Days: 9 },
                { code: 'EC3A', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 4 },
                { code: 'EC3M', assessorCount: 0, leadsLast30Days: 4, leadsPrevious30Days: 6 },
                { code: 'EC3N', assessorCount: 0, leadsLast30Days: 7, leadsPrevious30Days: 5 },
                { code: 'EC3R', assessorCount: 0, leadsLast30Days: 2, leadsPrevious30Days: 3 },
                { code: 'EC3V', assessorCount: 0, leadsLast30Days: 6, leadsPrevious30Days: 7 },
                { code: 'EC4A', assessorCount: 0, leadsLast30Days: 3, leadsPrevious30Days: 2 },
                { code: 'EC4M', assessorCount: 0, leadsLast30Days: 9, leadsPrevious30Days: 8 },
                { code: 'EC4N', assessorCount: 0, leadsLast30Days: 1, leadsPrevious30Days: 2 },
                { code: 'EC4R', assessorCount: 0, leadsLast30Days: 4, leadsPrevious30Days: 3 },
                { code: 'EC4V', assessorCount: 0, leadsLast30Days: 8, leadsPrevious30Days: 10 },
                { code: 'EC4Y', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 4 }
              ]
            },
            {
              id: 'westminster',
              name: 'Westminster',
              assessorCount: 6,
              leadsLast30Days: 127,
              leadsPrevious30Days: 115,
              postcodes: [
                { code: 'SW1A', assessorCount: 4, leadsLast30Days: 18 },
                { code: 'SW1E', assessorCount: 3, leadsLast30Days: 12 },
                { code: 'SW1H', assessorCount: 2, leadsLast30Days: 8 },
                { code: 'SW1P', assessorCount: 4, leadsLast30Days: 15 },
                { code: 'SW1V', assessorCount: 3, leadsLast30Days: 14 },
                { code: 'SW1W', assessorCount: 2, leadsLast30Days: 6, leadsPrevious30Days: 8 },
                { code: 'SW1X', assessorCount: 1, leadsLast30Days: 4, leadsPrevious30Days: 3 },
                { code: 'SW1Y', assessorCount: 0, leadsLast30Days: 11, leadsPrevious30Days: 7 },
                { code: 'W1A', assessorCount: 0, leadsLast30Days: 7, leadsPrevious30Days: 7 },
                { code: 'W1B', assessorCount: 0, leadsLast30Days: 9, leadsPrevious30Days: 12 },
                { code: 'W1C', assessorCount: 1, leadsLast30Days: 5, leadsPrevious30Days: 6 },
                { code: 'W1D', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 7 },
                { code: 'W1F', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 8 },
                { code: 'W1G', assessorCount: 0, leadsLast30Days: 10, leadsPrevious30Days: 8 },
                { code: 'W1H', assessorCount: 0, leadsLast30Days: 4, leadsPrevious30Days: 5 },
                { code: 'W1J', assessorCount: 0, leadsLast30Days: 12 },
                { code: 'W1K', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'W1S', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'W1T', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'W1U', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'W1W', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'W2', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'WC1A', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'WC1B', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'WC1E', assessorCount: 0, leadsLast30Days: 2 },
                { code: 'WC1H', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'WC1N', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'WC1R', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'WC1V', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'WC1X', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'WC2A', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'WC2B', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'WC2E', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'WC2H', assessorCount: 0, leadsLast30Days: 1 },
                { code: 'WC2N', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'WC2R', assessorCount: 0, leadsLast30Days: 6 }
              ]
            },
            {
              id: 'camden',
              name: 'Camden',
              assessorCount: 3,
              leadsLast30Days: 61,
              leadsPrevious30Days: 52,
              postcodes: [
                { code: 'NW1', assessorCount: 1, leadsLast30Days: 9 },
                { code: 'NW3', assessorCount: 1, leadsLast30Days: 12 },
                { code: 'NW5', assessorCount: 1, leadsLast30Days: 8 },
                { code: 'N1', assessorCount: 1, leadsLast30Days: 11 },
                { code: 'N7', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'N19', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'islington',
              name: 'Islington',
              assessorCount: 1,
              leadsLast30Days: 32,
              leadsPrevious30Days: 28,
              postcodes: [
                { code: 'N1', assessorCount: 1, leadsLast30Days: 11 },
                { code: 'N7', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'N19', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'kensington-chelsea',
              name: 'Kensington & Chelsea',
              assessorCount: 5,
              leadsLast30Days: 62,
              leadsPrevious30Days: 58,
              postcodes: [
                { code: 'SW3', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 9 },
                { code: 'SW5', assessorCount: 0, leadsLast30Days: 12, leadsPrevious30Days: 10 },
                { code: 'SW7', assessorCount: 2, leadsLast30Days: 6, leadsPrevious30Days: 8 },
                { code: 'SW10', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'W8', assessorCount: 1, leadsLast30Days: 5 },
                { code: 'W10', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'W11', assessorCount: 1, leadsLast30Days: 7 },
                { code: 'W14', assessorCount: 0, leadsLast30Days: 4 }
              ]
            },
            {
              id: 'hammersmith-fulham',
              name: 'Hammersmith & Fulham',
              assessorCount: 2,
              leadsLast30Days: 31,
              leadsPrevious30Days: 28,
              postcodes: [
                { code: 'SW6', assessorCount: 1, leadsLast30Days: 10 },
                { code: 'W6', assessorCount: 1, leadsLast30Days: 8 },
                { code: 'W12', assessorCount: 0, leadsLast30Days: 13 }
              ]
            }
          ]
        },
        {
          id: 'london-north',
          name: 'London (North)',
          assessorCount: 3,
          districtCount: 7,
          totalPostcodes: 56,
          activePostcodes: 6,
          districts: [
            {
              id: 'barnet',
              name: 'Barnet',
              assessorCount: 1,
              leadsLast30Days: 54,
              leadsPrevious30Days: 51,
              postcodes: [
                { code: 'N2', assessorCount: 0, leadsLast30Days: 8, leadsPrevious30Days: 6 },
                { code: 'N3', assessorCount: 1, leadsLast30Days: 5, leadsPrevious30Days: 8 },
                { code: 'N11', assessorCount: 0, leadsLast30Days: 12, leadsPrevious30Days: 9 },
                { code: 'N12', assessorCount: 0, leadsLast30Days: 7, leadsPrevious30Days: 8 },
                { code: 'N14', assessorCount: 0, leadsLast30Days: 9, leadsPrevious30Days: 7 },
                { code: 'N20', assessorCount: 0, leadsLast30Days: 6, leadsPrevious30Days: 9 },
                { code: 'EN4', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'EN5', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'HA8', assessorCount: 0, leadsLast30Days: 3 }
              ]
            },
            {
              id: 'enfield',
              name: 'Enfield',
              assessorCount: 0,
              leadsLast30Days: 60,
              leadsPrevious30Days: 55,
              postcodes: [
                { code: 'EN1', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'EN2', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'EN3', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'N9', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'N13', assessorCount: 0, leadsLast30Days: 13 },
                { code: 'N14', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'N18', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'N21', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'haringey',
              name: 'Haringey',
              assessorCount: 1,
              leadsLast30Days: 68,
              leadsPrevious30Days: 62,
              postcodes: [
                { code: 'N4', assessorCount: 1, leadsLast30Days: 12 },
                { code: 'N6', assessorCount: 0, leadsLast30Days: 15 },
                { code: 'N8', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'N10', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'N15', assessorCount: 0, leadsLast30Days: 16 },
                { code: 'N17', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'N22', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'harrow',
              name: 'Harrow',
              assessorCount: 1,
              leadsLast30Days: 50,
              leadsPrevious30Days: 48,
              postcodes: [
                { code: 'HA1', assessorCount: 1, leadsLast30Days: 10 },
                { code: 'HA2', assessorCount: 0, leadsLast30Days: 13 },
                { code: 'HA3', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'HA5', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'HA6', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'HA7', assessorCount: 0, leadsLast30Days: 8 }
              ]
            },
            {
              id: 'brent',
              name: 'Brent',
              assessorCount: 0,
              leadsLast30Days: 49,
              leadsPrevious30Days: 46,
              postcodes: [
                { code: 'NW2', assessorCount: 0, leadsLast30Days: 12 },
                { code: 'NW9', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'NW10', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'HA0', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'HA9', assessorCount: 0, leadsLast30Days: 11 }
              ]
            },
            {
              id: 'waltham-forest',
              name: 'Waltham Forest',
              assessorCount: 0,
              leadsLast30Days: 59,
              leadsPrevious30Days: 55,
              postcodes: [
                { code: 'E4', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'E10', assessorCount: 0, leadsLast30Days: 18 },
                { code: 'E11', assessorCount: 0, leadsLast30Days: 12 },
                { code: 'E17', assessorCount: 0, leadsLast30Days: 15 }
              ]
            },
            {
              id: 'hillingdon',
              name: 'Hillingdon',
              assessorCount: 1,
              leadsLast30Days: 80,
              leadsPrevious30Days: 74,
              postcodes: [
                { code: 'UB3', assessorCount: 1, leadsLast30Days: 9 },
                { code: 'UB4', assessorCount: 0, leadsLast30Days: 17 },
                { code: 'UB7', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'UB8', assessorCount: 0, leadsLast30Days: 12 },
                { code: 'UB9', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'UB10', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'UB11', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'HA4', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'HA6', assessorCount: 0, leadsLast30Days: 6 }
              ]
            }
          ]
        },
        {
          id: 'london-south',
          name: 'London (South)',
          assessorCount: 8,
          districtCount: 9,
          totalPostcodes: 90,
          activePostcodes: 16,
          districts: [
            {
              id: 'lambeth',
              name: 'Lambeth',
              assessorCount: 2,
              leadsLast30Days: 42,
              leadsPrevious30Days: 38,
              postcodes: [
                { code: 'SE1', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 7 },
                { code: 'SE11', assessorCount: 1, leadsLast30Days: 4, leadsPrevious30Days: 6 },
                { code: 'SE24', assessorCount: 0, leadsLast30Days: 8, leadsPrevious30Days: 5 },
                { code: 'SW2', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'SW4', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'SW8', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'SW9', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'SW16', assessorCount: 0, leadsLast30Days: 4 }
              ]
            },
            {
              id: 'southwark',
              name: 'Southwark',
              assessorCount: 1,
              leadsLast30Days: 44,
              leadsPrevious30Days: 42,
              postcodes: [
                { code: 'SE5', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'SE15', assessorCount: 1, leadsLast30Days: 7 },
                { code: 'SE16', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'SE17', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'SE21', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'SE22', assessorCount: 0, leadsLast30Days: 8 }
              ]
            },
            {
              id: 'wandsworth',
              name: 'Wandsworth',
              assessorCount: 3,
              leadsLast30Days: 32,
              leadsPrevious30Days: 30,
              postcodes: [
                { code: 'SW11', assessorCount: 1, leadsLast30Days: 5 },
                { code: 'SW12', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'SW15', assessorCount: 1, leadsLast30Days: 4 },
                { code: 'SW17', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'SW18', assessorCount: 1, leadsLast30Days: 6 }
              ]
            },
            {
              id: 'lewisham',
              name: 'Lewisham',
              assessorCount: 1,
              leadsLast30Days: 45,
              leadsPrevious30Days: 42,
              postcodes: [
                { code: 'SE4', assessorCount: 1, leadsLast30Days: 8 },
                { code: 'SE6', assessorCount: 0, leadsLast30Days: 12 },
                { code: 'SE8', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'SE13', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'SE14', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'SE23', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'greenwich',
              name: 'Greenwich',
              assessorCount: 1,
              leadsLast30Days: 33,
              leadsPrevious30Days: 31,
              postcodes: [
                { code: 'SE3', assessorCount: 1, leadsLast30Days: 6 },
                { code: 'SE7', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'SE9', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'SE10', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'SE18', assessorCount: 0, leadsLast30Days: 5 }
              ]
            },
            {
              id: 'bromley',
              name: 'Bromley',
              assessorCount: 1,
              leadsLast30Days: 61,
              leadsPrevious30Days: 58,
              postcodes: [
                { code: 'BR1', assessorCount: 1, leadsLast30Days: 9 },
                { code: 'BR2', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'BR3', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'BR4', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'BR5', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'BR6', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'BR7', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'BR8', assessorCount: 0, leadsLast30Days: 2 },
                { code: 'SE19', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'SE20', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'SE25', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'SE26', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'croydon',
              name: 'Croydon',
              assessorCount: 0,
              leadsLast30Days: 66,
              leadsPrevious30Days: 62,
              postcodes: [
                { code: 'CR0', assessorCount: 0, leadsLast30Days: 13 },
                { code: 'CR2', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'CR3', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'CR4', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'CR5', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'CR6', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'CR7', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'CR8', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'CR9', assessorCount: 0, leadsLast30Days: 11 }
              ]
            },
            {
              id: 'merton',
              name: 'Merton',
              assessorCount: 0,
              leadsLast30Days: 20,
              leadsPrevious30Days: 18,
              postcodes: [
                { code: 'SW19', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'SW20', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'CR4', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'sutton',
              name: 'Sutton',
              assessorCount: 0,
              leadsLast30Days: 37,
              leadsPrevious30Days: 34,
              postcodes: [
                { code: 'SM1', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'SM2', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'SM3', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'SM4', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'SM5', assessorCount: 0, leadsLast30Days: 3 },
                { code: 'SM6', assessorCount: 0, leadsLast30Days: 7 }
              ]
            }
          ]
        },
        {
          id: 'london-east',
          name: 'London (East)',
          assessorCount: 4,
          districtCount: 6,
          totalPostcodes: 51,
          activePostcodes: 8,
          districts: [
            {
              id: 'tower-hamlets',
              name: 'Tower Hamlets',
              assessorCount: 2,
              leadsLast30Days: 68,
              leadsPrevious30Days: 67,
              postcodes: [
                { code: 'E1', assessorCount: 1, leadsLast30Days: 14, leadsPrevious30Days: 16 },
                { code: 'E2', assessorCount: 0, leadsLast30Days: 18, leadsPrevious30Days: 15 },
                { code: 'E3', assessorCount: 0, leadsLast30Days: 12, leadsPrevious30Days: 12 },
                { code: 'E14', assessorCount: 1, leadsLast30Days: 16, leadsPrevious30Days: 14 },
                { code: 'E1W', assessorCount: 0, leadsLast30Days: 8, leadsPrevious30Days: 10 }
              ]
            },
            {
              id: 'hackney',
              name: 'Hackney',
              assessorCount: 1,
              leadsLast30Days: 83,
              leadsPrevious30Days: 79,
              postcodes: [
                { code: 'E5', assessorCount: 0, leadsLast30Days: 21 },
                { code: 'E8', assessorCount: 1, leadsLast30Days: 15 },
                { code: 'E9', assessorCount: 0, leadsLast30Days: 19 },
                { code: 'N1', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'N16', assessorCount: 0, leadsLast30Days: 17 }
              ]
            },
            {
              id: 'newham',
              name: 'Newham',
              assessorCount: 1,
              leadsLast30Days: 87,
              leadsPrevious30Days: 82,
              postcodes: [
                { code: 'E6', assessorCount: 1, leadsLast30Days: 13 },
                { code: 'E7', assessorCount: 0, leadsLast30Days: 22 },
                { code: 'E12', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'E13', assessorCount: 0, leadsLast30Days: 16 },
                { code: 'E15', assessorCount: 0, leadsLast30Days: 20 },
                { code: 'E16', assessorCount: 0, leadsLast30Days: 7 }
              ]
            },
            {
              id: 'redbridge',
              name: 'Redbridge',
              assessorCount: 0,
              leadsLast30Days: 103,
              leadsPrevious30Days: 98,
              postcodes: [
                { code: 'IG1', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'IG2', assessorCount: 0, leadsLast30Days: 13 },
                { code: 'IG3', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'IG4', assessorCount: 0, leadsLast30Days: 16 },
                { code: 'IG5', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'IG6', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'IG7', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'IG8', assessorCount: 0, leadsLast30Days: 12 }
              ]
            },
            {
              id: 'barking-dagenham',
              name: 'Barking & Dagenham',
              assessorCount: 0,
              leadsLast30Days: 55,
              leadsPrevious30Days: 52,
              postcodes: [
                { code: 'IG11', assessorCount: 0, leadsLast30Days: 17 },
                { code: 'RM8', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'RM9', assessorCount: 0, leadsLast30Days: 19 },
                { code: 'RM10', assessorCount: 0, leadsLast30Days: 13 }
              ]
            },
            {
              id: 'havering',
              name: 'Havering',
              assessorCount: 0,
              leadsLast30Days: 113,
              leadsPrevious30Days: 107,
              postcodes: [
                { code: 'RM1', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'RM2', assessorCount: 0, leadsLast30Days: 15 },
                { code: 'RM3', assessorCount: 0, leadsLast30Days: 11 },
                { code: 'RM4', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'RM5', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'RM6', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'RM7', assessorCount: 0, leadsLast30Days: 16 },
                { code: 'RM11', assessorCount: 0, leadsLast30Days: 9 },
                { code: 'RM12', assessorCount: 0, leadsLast30Days: 12 },
                { code: 'RM13', assessorCount: 0, leadsLast30Days: 18 },
                { code: 'RM14', assessorCount: 0, leadsLast30Days: 5 }
              ]
            }
          ]
        },
        {
          id: 'london-west',
          name: 'London (West)',
          assessorCount: 12,
          districtCount: 6,
          totalPostcodes: 49,
          activePostcodes: 20,
          districts: [
            {
              id: 'ealing',
              name: 'Ealing',
              assessorCount: 2,
              leadsLast30Days: 65,
              leadsPrevious30Days: 62,
              postcodes: [
                { code: 'W3', assessorCount: 0, leadsLast30Days: 15 },
                { code: 'W5', assessorCount: 1, leadsLast30Days: 9 },
                { code: 'W7', assessorCount: 1, leadsLast30Days: 6 },
                { code: 'W13', assessorCount: 0, leadsLast30Days: 12 },
                { code: 'UB1', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'UB2', assessorCount: 0, leadsLast30Days: 14 },
                { code: 'UB5', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'UB6', assessorCount: 0, leadsLast30Days: 11 }
              ]
            },
            {
              id: 'hounslow',
              name: 'Hounslow',
              assessorCount: 1,
              leadsLast30Days: 54,
              leadsPrevious30Days: 51,
              postcodes: [
                { code: 'TW3', assessorCount: 1, leadsLast30Days: 7 },
                { code: 'TW4', assessorCount: 0, leadsLast30Days: 16 },
                { code: 'TW5', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'TW6', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'TW7', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'TW8', assessorCount: 0, leadsLast30Days: 13 },
                { code: 'TW14', assessorCount: 0, leadsLast30Days: 8 }
              ]
            },
            {
              id: 'richmond',
              name: 'Richmond upon Thames',
              assessorCount: 0,
              leadsLast30Days: 49,
              leadsPrevious30Days: 46,
              postcodes: [
                { code: 'TW1', assessorCount: 0, leadsLast30Days: 7 },
                { code: 'TW2', assessorCount: 0, leadsLast30Days: 10 },
                { code: 'TW9', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'TW10', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'TW11', assessorCount: 0, leadsLast30Days: 8 },
                { code: 'TW12', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'TW13', assessorCount: 0, leadsLast30Days: 9 }
              ]
            },
            {
              id: 'kingston',
              name: 'Kingston upon Thames',
              assessorCount: 3,
              leadsLast30Days: 46,
              leadsPrevious30Days: 43,
              postcodes: [
                { code: 'KT1', assessorCount: 1, leadsLast30Days: 11 },
                { code: 'KT2', assessorCount: 0, leadsLast30Days: 6 },
                { code: 'KT3', assessorCount: 0, leadsLast30Days: 4 },
                { code: 'KT4', assessorCount: 1, leadsLast30Days: 8 },
                { code: 'KT5', assessorCount: 0, leadsLast30Days: 5 },
                { code: 'KT6', assessorCount: 1, leadsLast30Days: 9 },
                { code: 'KT9', assessorCount: 0, leadsLast30Days: 3 }
              ]
            }
          ]
        },
        {
          id: 'essex',
          name: 'Essex',
          assessorCount: 12,
          districtCount: 8,
          totalPostcodes: 89,
          activePostcodes: 76,
          districts: [
            {
              id: 'chelmsford',
              name: 'Chelmsford',
              assessorCount: 4,
              leadsLast30Days: 18,
              leadsPrevious30Days: 16,
              postcodes: [
                { code: 'CM1', assessorCount: 2, leadsLast30Days: 9 },
                { code: 'CM2', assessorCount: 2, leadsLast30Days: 9 }
              ]
            },
            {
              id: 'colchester',
              name: 'Colchester',
              assessorCount: 3,
              leadsLast30Days: 14,
              leadsPrevious30Days: 19,
              postcodes: [
                { code: 'CO1', assessorCount: 2, leadsLast30Days: 8 },
                { code: 'CO2', assessorCount: 1, leadsLast30Days: 6 }
              ]
            }
          ]
        },
        {
          id: 'kent',
          name: 'Kent',
          assessorCount: 15,
          districtCount: 6,
          totalPostcodes: 98,
          activePostcodes: 89,
          districts: [
            {
              id: 'canterbury',
              name: 'Canterbury',
              assessorCount: 5,
              leadsLast30Days: 22,
              leadsPrevious30Days: 18,
              postcodes: [
                { code: 'CT1', assessorCount: 3, leadsLast30Days: 13 },
                { code: 'CT2', assessorCount: 2, leadsLast30Days: 9 }
              ]
            },
            {
              id: 'maidstone',
              name: 'Maidstone',
              assessorCount: 4,
              leadsLast30Days: 19,
              leadsPrevious30Days: 21,
              postcodes: [
                { code: 'ME14', assessorCount: 2, leadsLast30Days: 11 },
                { code: 'ME15', assessorCount: 2, leadsLast30Days: 8 }
              ]
            }
          ]
        },
        {
          id: 'surrey',
          name: 'Surrey',
          assessorCount: 8,
          districtCount: 4,
          totalPostcodes: 45,
          activePostcodes: 38,
          districts: [
            {
              id: 'guildford',
              name: 'Guildford',
              assessorCount: 3,
              leadsLast30Days: 15,
              leadsPrevious30Days: 12,
              postcodes: [
                { code: 'GU1', assessorCount: 2, leadsLast30Days: 8, leadsPrevious30Days: 6 },
                { code: 'GU2', assessorCount: 1, leadsLast30Days: 7, leadsPrevious30Days: 6 }
              ]
            },
            {
              id: 'woking',
              name: 'Woking',
              assessorCount: 2,
              leadsLast30Days: 9,
              leadsPrevious30Days: 11,
              postcodes: [
                { code: 'GU21', assessorCount: 1, leadsLast30Days: 5, leadsPrevious30Days: 7 },
                { code: 'GU22', assessorCount: 1, leadsLast30Days: 4, leadsPrevious30Days: 4 }
              ]
            },
            {
              id: 'epsom',
              name: 'Epsom',
              assessorCount: 2,
              leadsLast30Days: 11,
              leadsPrevious30Days: 8,
              postcodes: [
                { code: 'KT17', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 4 },
                { code: 'KT18', assessorCount: 1, leadsLast30Days: 5, leadsPrevious30Days: 4 }
              ]
            },
            {
              id: 'reigate',
              name: 'Reigate',
              assessorCount: 1,
              leadsLast30Days: 7,
              leadsPrevious30Days: 9,
              postcodes: [
                { code: 'RH1', assessorCount: 0, leadsLast30Days: 4, leadsPrevious30Days: 5 },
                { code: 'RH2', assessorCount: 1, leadsLast30Days: 3, leadsPrevious30Days: 4 }
              ]
            }
          ]
        },
        {
          id: 'birmingham-west-midlands',
          name: 'Birmingham & West Midlands',
          assessorCount: 12,
          districtCount: 6,
          totalPostcodes: 78,
          activePostcodes: 65,
          districts: [
            {
              id: 'birmingham-central',
              name: 'Birmingham Central',
              assessorCount: 4,
              leadsLast30Days: 35,
              leadsPrevious30Days: 28,
              postcodes: [
                { code: 'B1', assessorCount: 2, leadsLast30Days: 12, leadsPrevious30Days: 9 },
                { code: 'B2', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 7 },
                { code: 'B3', assessorCount: 1, leadsLast30Days: 15, leadsPrevious30Days: 12 }
              ]
            },
            {
              id: 'coventry',
              name: 'Coventry',
              assessorCount: 3,
              leadsLast30Days: 18,
              leadsPrevious30Days: 22,
              postcodes: [
                { code: 'CV1', assessorCount: 2, leadsLast30Days: 10, leadsPrevious30Days: 12 },
                { code: 'CV2', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 10 }
              ]
            },
            {
              id: 'wolverhampton',
              name: 'Wolverhampton',
              assessorCount: 2,
              leadsLast30Days: 14,
              leadsPrevious30Days: 16,
              postcodes: [
                { code: 'WV1', assessorCount: 1, leadsLast30Days: 7, leadsPrevious30Days: 8 },
                { code: 'WV2', assessorCount: 1, leadsLast30Days: 7, leadsPrevious30Days: 8 }
              ]
            },
            {
              id: 'solihull',
              name: 'Solihull',
              assessorCount: 2,
              leadsLast30Days: 12,
              leadsPrevious30Days: 10,
              postcodes: [
                { code: 'B90', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 5 },
                { code: 'B91', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 5 }
              ]
            },
            {
              id: 'walsall',
              name: 'Walsall',
              assessorCount: 1,
              leadsLast30Days: 9,
              leadsPrevious30Days: 11,
              postcodes: [
                { code: 'WS1', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 6 },
                { code: 'WS2', assessorCount: 1, leadsLast30Days: 4, leadsPrevious30Days: 5 }
              ]
            },
            {
              id: 'dudley',
              name: 'Dudley',
              assessorCount: 0,
              leadsLast30Days: 13,
              leadsPrevious30Days: 15,
              postcodes: [
                { code: 'DY1', assessorCount: 0, leadsLast30Days: 7, leadsPrevious30Days: 8 },
                { code: 'DY2', assessorCount: 0, leadsLast30Days: 6, leadsPrevious30Days: 7 }
              ]
            }
          ]
        },
        {
          id: 'manchester-greater',
          name: 'Greater Manchester',
          assessorCount: 9,
          districtCount: 5,
          totalPostcodes: 89,
          activePostcodes: 72,
          districts: [
            {
              id: 'manchester-central',
              name: 'Manchester Central',
              assessorCount: 3,
              leadsLast30Days: 28,
              leadsPrevious30Days: 24,
              postcodes: [
                { code: 'M1', assessorCount: 2, leadsLast30Days: 12, leadsPrevious30Days: 10 },
                { code: 'M2', assessorCount: 1, leadsLast30Days: 16, leadsPrevious30Days: 14 }
              ]
            },
            {
              id: 'stockport',
              name: 'Stockport',
              assessorCount: 2,
              leadsLast30Days: 16,
              leadsPrevious30Days: 18,
              postcodes: [
                { code: 'SK1', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 9 },
                { code: 'SK2', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 9 }
              ]
            },
            {
              id: 'bolton',
              name: 'Bolton',
              assessorCount: 2,
              leadsLast30Days: 15,
              leadsPrevious30Days: 13,
              postcodes: [
                { code: 'BL1', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 7 },
                { code: 'BL2', assessorCount: 1, leadsLast30Days: 7, leadsPrevious30Days: 6 }
              ]
            },
            {
              id: 'oldham',
              name: 'Oldham',
              assessorCount: 1,
              leadsLast30Days: 11,
              leadsPrevious30Days: 13,
              postcodes: [
                { code: 'OL1', assessorCount: 0, leadsLast30Days: 6, leadsPrevious30Days: 7 },
                { code: 'OL2', assessorCount: 1, leadsLast30Days: 5, leadsPrevious30Days: 6 }
              ]
            },
            {
              id: 'rochdale',
              name: 'Rochdale',
              assessorCount: 1,
              leadsLast30Days: 9,
              leadsPrevious30Days: 11,
              postcodes: [
                { code: 'OL10', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 6 },
                { code: 'OL11', assessorCount: 1, leadsLast30Days: 4, leadsPrevious30Days: 5 }
              ]
            }
          ]
        },
        {
          id: 'liverpool-merseyside',
          name: 'Liverpool & Merseyside',
          assessorCount: 6,
          districtCount: 4,
          totalPostcodes: 56,
          activePostcodes: 48,
          districts: [
            {
              id: 'liverpool-central',
              name: 'Liverpool Central',
              assessorCount: 3,
              leadsLast30Days: 22,
              leadsPrevious30Days: 19,
              postcodes: [
                { code: 'L1', assessorCount: 2, leadsLast30Days: 12, leadsPrevious30Days: 10 },
                { code: 'L2', assessorCount: 1, leadsLast30Days: 10, leadsPrevious30Days: 9 }
              ]
            },
            {
              id: 'wirral',
              name: 'Wirral',
              assessorCount: 2,
              leadsLast30Days: 14,
              leadsPrevious30Days: 16,
              postcodes: [
                { code: 'CH41', assessorCount: 1, leadsLast30Days: 7, leadsPrevious30Days: 8 },
                { code: 'CH42', assessorCount: 1, leadsLast30Days: 7, leadsPrevious30Days: 8 }
              ]
            },
            {
              id: 'st-helens',
              name: 'St Helens',
              assessorCount: 1,
              leadsLast30Days: 8,
              leadsPrevious30Days: 10,
              postcodes: [
                { code: 'WA9', assessorCount: 0, leadsLast30Days: 4, leadsPrevious30Days: 5 },
                { code: 'WA10', assessorCount: 1, leadsLast30Days: 4, leadsPrevious30Days: 5 }
              ]
            },
            {
              id: 'southport',
              name: 'Southport',
              assessorCount: 0,
              leadsLast30Days: 6,
              leadsPrevious30Days: 8,
              postcodes: [
                { code: 'PR8', assessorCount: 0, leadsLast30Days: 3, leadsPrevious30Days: 4 },
                { code: 'PR9', assessorCount: 0, leadsLast30Days: 3, leadsPrevious30Days: 4 }
              ]
            }
          ]
        },
        {
          id: 'wales',
          name: 'Wales',
          assessorCount: 8,
          districtCount: 6,
          totalPostcodes: 67,
          activePostcodes: 52,
          districts: [
            {
              id: 'cardiff',
              name: 'Cardiff & South Wales',
              assessorCount: 3,
              leadsLast30Days: 19,
              leadsPrevious30Days: 16,
              postcodes: [
                { code: 'CF10', assessorCount: 2, leadsLast30Days: 8, leadsPrevious30Days: 6 },
                { code: 'CF11', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 5 },
                { code: 'CF14', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 5 }
              ]
            },
            {
              id: 'swansea',
              name: 'Swansea & West Wales',
              assessorCount: 2,
              leadsLast30Days: 12,
              leadsPrevious30Days: 14,
              postcodes: [
                { code: 'SA1', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 7 },
                { code: 'SA2', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 7 }
              ]
            },
            {
              id: 'newport',
              name: 'Newport & Gwent',
              assessorCount: 1,
              leadsLast30Days: 9,
              leadsPrevious30Days: 11,
              postcodes: [
                { code: 'NP19', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 6 },
                { code: 'NP20', assessorCount: 1, leadsLast30Days: 4, leadsPrevious30Days: 5 }
              ]
            },
            {
              id: 'wrexham',
              name: 'Wrexham & North Wales',
              assessorCount: 1,
              leadsLast30Days: 7,
              leadsPrevious30Days: 9,
              postcodes: [
                { code: 'LL11', assessorCount: 0, leadsLast30Days: 4, leadsPrevious30Days: 5 },
                { code: 'LL12', assessorCount: 1, leadsLast30Days: 3, leadsPrevious30Days: 4 }
              ]
            },
            {
              id: 'bangor',
              name: 'Bangor & Anglesey',
              assessorCount: 1,
              leadsLast30Days: 5,
              leadsPrevious30Days: 7,
              postcodes: [
                { code: 'LL57', assessorCount: 0, leadsLast30Days: 3, leadsPrevious30Days: 4 },
                { code: 'LL58', assessorCount: 1, leadsLast30Days: 2, leadsPrevious30Days: 3 }
              ]
            },
            {
              id: 'aberystwyth',
              name: 'Aberystwyth & Mid Wales',
              assessorCount: 0,
              leadsLast30Days: 4,
              leadsPrevious30Days: 6,
              postcodes: [
                { code: 'SY23', assessorCount: 0, leadsLast30Days: 2, leadsPrevious30Days: 3 },
                { code: 'SY24', assessorCount: 0, leadsLast30Days: 2, leadsPrevious30Days: 3 }
              ]
            }
          ]
        },
        {
          id: 'yorkshire',
          name: 'Yorkshire',
          assessorCount: 11,
          districtCount: 5,
          totalPostcodes: 94,
          activePostcodes: 78,
          districts: [
            {
              id: 'leeds',
              name: 'Leeds',
              assessorCount: 4,
              leadsLast30Days: 26,
              leadsPrevious30Days: 22,
              postcodes: [
                { code: 'LS1', assessorCount: 2, leadsLast30Days: 12, leadsPrevious30Days: 10 },
                { code: 'LS2', assessorCount: 2, leadsLast30Days: 14, leadsPrevious30Days: 12 }
              ]
            },
            {
              id: 'sheffield',
              name: 'Sheffield',
              assessorCount: 3,
              leadsLast30Days: 20,
              leadsPrevious30Days: 18,
              postcodes: [
                { code: 'S1', assessorCount: 2, leadsLast30Days: 11, leadsPrevious30Days: 9 },
                { code: 'S2', assessorCount: 1, leadsLast30Days: 9, leadsPrevious30Days: 9 }
              ]
            },
            {
              id: 'bradford',
              name: 'Bradford',
              assessorCount: 2,
              leadsLast30Days: 15,
              leadsPrevious30Days: 17,
              postcodes: [
                { code: 'BD1', assessorCount: 1, leadsLast30Days: 8, leadsPrevious30Days: 9 },
                { code: 'BD2', assessorCount: 1, leadsLast30Days: 7, leadsPrevious30Days: 8 }
              ]
            },
            {
              id: 'york',
              name: 'York',
              assessorCount: 2,
              leadsLast30Days: 12,
              leadsPrevious30Days: 10,
              postcodes: [
                { code: 'YO1', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 5 },
                { code: 'YO10', assessorCount: 1, leadsLast30Days: 6, leadsPrevious30Days: 5 }
              ]
            },
            {
              id: 'hull',
              name: 'Hull',
              assessorCount: 0,
              leadsLast30Days: 11,
              leadsPrevious30Days: 13,
              postcodes: [
                { code: 'HU1', assessorCount: 0, leadsLast30Days: 6, leadsPrevious30Days: 7 },
                { code: 'HU2', assessorCount: 0, leadsLast30Days: 5, leadsPrevious30Days: 6 }
              ]
            }
          ]
        }
      ];

      setCounties(mockData);
    } catch (error) {
      console.error('Error fetching coverage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCountyExpansion = (countyId: string) => {
    const newExpanded = new Set(expandedCounties);
    if (newExpanded.has(countyId)) {
      newExpanded.delete(countyId);
    } else {
      newExpanded.add(countyId);
    }
    setExpandedCounties(newExpanded);
  };

  const toggleDistrictExpansion = (districtId: string) => {
    const newExpanded = new Set(expandedDistricts);
    if (newExpanded.has(districtId)) {
      newExpanded.delete(districtId);
    } else {
      newExpanded.add(districtId);
    }
    setExpandedDistricts(newExpanded);
  };

  const getTotalStats = () => {
    return counties.reduce(
      (acc, county) => ({
        totalAssessors: acc.totalAssessors + county.assessorCount,
        totalCounties: acc.totalCounties + 1,
        totalDistricts: acc.totalDistricts + county.districtCount,
        totalPostcodes: acc.totalPostcodes + county.totalPostcodes,
        activePostcodes: acc.activePostcodes + county.activePostcodes
      }),
      { totalAssessors: 0, totalCounties: 0, totalDistricts: 0, totalPostcodes: 0, activePostcodes: 0 }
    );
  };

  const handleCardFilter = (filterType: 'low' | 'gaps') => {
    if (activeFilter === filterType) {
      setActiveFilter(null); // Toggle off if same filter clicked
    } else {
      setActiveFilter(filterType);
      setSearchTerm(''); // Clear search when filtering
    }
  };

  const isLowCoverage = (assessorCount: number) => {
    return assessorCount > 0 && assessorCount <= 2; // 1-2 assessors = low coverage
  };

  const isCoverageGap = (assessorCount: number) => {
    return assessorCount === 0; // 0 assessors = coverage gap
  };

  const getTrendIndicator = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;

    const percentChange = Math.round(((current - previous) / previous) * 100);

    if (current > previous) {
      return (
        <span className="trend-indicator trend-up">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 9L6 5L10 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          +{percentChange}%
        </span>
      );
    }

    if (current < previous) {
      return (
        <span className="trend-indicator trend-down">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 3L6 7L10 3" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {percentChange}%
        </span>
      );
    }

    return (
      <span className="trend-indicator trend-stable">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L10 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        0%
      </span>
    );
  };

  // Auto-expand logic when searching
  const shouldAutoExpand = searchTerm.trim() !== '';

  React.useEffect(() => {
    if (shouldAutoExpand) {
      // Auto-expand counties and districts when searching
      const newExpandedCounties = new Set<string>();
      const newExpandedDistricts = new Set<string>();

      counties.forEach(county => {
        const hasMatch = county.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          county.districts.some(district =>
            district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
            district.postcodes.some(postcode =>
              postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
            )
          );

        if (hasMatch) {
          newExpandedCounties.add(county.id);

          // Also expand districts that have matching postcodes
          county.districts.forEach(district => {
            const districtHasMatch = district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
              district.postcodes.some(postcode =>
                postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
              );

            if (districtHasMatch) {
              newExpandedDistricts.add(district.id);
            }
          });
        }
      });

      setExpandedCounties(newExpandedCounties);
      setExpandedDistricts(newExpandedDistricts);
    } else {
      // Collapse all when search is cleared
      setExpandedCounties(new Set());
      setExpandedDistricts(new Set());
    }
  }, [searchTerm, counties]);

  const filteredCounties = counties.filter(county => {
    // First apply search filter
    const searchMatch = county.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      county.districts.some(district =>
        district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        district.postcodes.some(postcode =>
          postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      );

    if (searchTerm && !searchMatch) return false;

    // Then apply card filters
    if (activeFilter === 'low') {
      return county.districts.some(district => isLowCoverage(district.assessorCount));
    }
    if (activeFilter === 'gaps') {
      return county.districts.some(district => isCoverageGap(district.assessorCount));
    }

    return searchTerm ? searchMatch : true;
  }).map(county => ({
    ...county,
    districts: county.districts.filter(district => {
      // When searching, include districts that have matching postcodes
      if (searchTerm) {
        const districtMatch = district.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          district.postcodes.some(postcode =>
            postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase())
          );
        if (!districtMatch) return false;
      }

      if (activeFilter === 'low') {
        return isLowCoverage(district.assessorCount);
      }
      if (activeFilter === 'gaps') {
        return isCoverageGap(district.assessorCount);
      }
      return true;
    }).map(district => ({
      ...district,
      postcodes: district.postcodes.filter(postcode => {
        // When searching, only show matching postcodes
        if (searchTerm) {
          return postcode.code.toLowerCase().startsWith(searchTerm.toLowerCase());
        }
        return true;
      })
    }))
  }));

  if (loading) {
    return (
      <div className="coverage-loading">
        <div className="loading-spinner"></div>
        <p>Loading coverage data...</p>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="coverage-management">
      <div className="coverage-header">
        <div className="header-content">
          <div>
            <h1>Coverage Management</h1>
            <p>Manage assessor coverage areas across counties and postcodes (Updated Structure)</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Assessors</div>
          <div className="card-value">{stats.totalAssessors}</div>
          <div className="card-sub">Across all regions</div>
        </div>
        <div className="summary-card success">
          <div className="card-label">Total Coverage</div>
          <div className="card-value">{Math.round((stats.activePostcodes / stats.totalPostcodes) * 100)}%</div>
          <div className="card-sub">{stats.activePostcodes} of {stats.totalPostcodes} areas</div>
        </div>
        <div
          className={`summary-card warning ${activeFilter === 'low' ? 'active-filter' : ''}`}
          onClick={() => handleCardFilter('low')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-label">Low Coverage</div>
          <div className="card-value">{Math.floor((stats.totalPostcodes - stats.activePostcodes) * 0.6)}</div>
          <div className="card-sub">{activeFilter === 'low' ? 'Click to clear filter' : 'Areas need attention'}</div>
        </div>
        <div
          className={`summary-card danger ${activeFilter === 'gaps' ? 'active-filter' : ''}`}
          onClick={() => handleCardFilter('gaps')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-label">Coverage Gaps</div>
          <div className="card-value">{stats.totalPostcodes - stats.activePostcodes}</div>
          <div className="card-sub">{activeFilter === 'gaps' ? 'Click to clear filter' : 'No assessors'}</div>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search counties, districts, or postcodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {activeFilter && (
          <div className="filter-indicator">
            <span>Showing {activeFilter === 'low' ? 'Low Coverage' : 'Coverage Gaps'} areas</span>
            <button
              className="clear-filter-btn"
              onClick={() => setActiveFilter(null)}
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Coverage Table */}
      <div className="coverage-table">
        <div className="table-header">
          <div className="header-row">
            <div className="header-cell"></div>
            <div className="header-cell name-col">Area</div>
            <div className="header-cell">Assessors</div>
            <div className="header-cell">Districts</div>
            <div className="header-cell">Postcodes</div>
            <div className="header-cell">Coverage</div>
            <div className="header-cell">Leads Last 30 Days</div>
          </div>
        </div>

        <div className="table-body">
          {filteredCounties.map((county) => {
            const isCountyExpanded = expandedCounties.has(county.id);
            const coveragePercentage = Math.round((county.activePostcodes / county.totalPostcodes) * 100);

            return (
              <div key={county.id} className="table-section">
                {/* County Row */}
                <div
                  className={`table-row county-row ${isCountyExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleCountyExpansion(county.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="table-cell">
                    <button
                      className="expand-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCountyExpansion(county.id);
                      }}
                    >
                      {isCountyExpanded ? '▼' : '▶'}
                    </button>
                  </div>
                  <div className="table-cell name-col">
                    <span className="location-name">{county.name}</span>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">{county.assessorCount}</span>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">{county.districtCount}</span>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">{county.activePostcodes}/{county.totalPostcodes}</span>
                  </div>
                  <div className="table-cell">
                    <div className="coverage-bar">
                      <div
                        className="coverage-fill"
                        style={{ width: `${coveragePercentage}%` }}
                      ></div>
                      <span className="coverage-text">{coveragePercentage}%</span>
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="metric-value">
                      {county.districts.reduce((sum, d) => sum + d.leadsLast30Days, 0)} {getTrendIndicator(
                        county.districts.reduce((sum, d) => sum + d.leadsLast30Days, 0),
                        county.districts.reduce((sum, d) => sum + d.leadsPrevious30Days, 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* District Rows */}
                {isCountyExpanded && county.districts.map((district) => {
                  const isDistrictExpanded = expandedDistricts.has(district.id);
                  const activePostcodes = district.postcodes.filter(p => p.assessorCount > 0).length;
                  const districtCoverage = Math.round((activePostcodes / district.postcodes.length) * 100);

                  return (
                    <div key={district.id} className="district-section">
                      {/* District Row */}
                      <div
                        className="table-row district-row"
                        onClick={() => toggleDistrictExpansion(district.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="table-cell expand-col">
                          <button
                            className="expand-btn district-expand"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDistrictExpansion(district.id);
                            }}
                          >
                            {isDistrictExpanded ? '▼' : '▶'}
                          </button>
                        </div>
                        <div className="table-cell name-col">
                          <span className="district-name">{district.name}</span>
                        </div>
                        <div className="table-cell assessors-col">
                          <span className="assessor-count">{district.assessorCount}</span>
                        </div>
                        <div className="table-cell districts-col">
                          -
                        </div>
                        <div className="table-cell postcodes-col">
                          {activePostcodes}/{district.postcodes.length}
                        </div>
                        <div className="table-cell coverage-col">
                          <div className="coverage-bar small">
                            <div
                              className="coverage-fill"
                              style={{ width: `${districtCoverage}%` }}
                            ></div>
                            <span className="coverage-text">{districtCoverage}%</span>
                          </div>
                        </div>
                        <div className="table-cell">
                          <span
                            className="metric-value leads-count"
                            data-priority={district.leadsLast30Days > 30 && district.assessorCount < 4 ? 'high' : ''}
                          >
                            {district.leadsLast30Days} {getTrendIndicator(district.leadsLast30Days, district.leadsPrevious30Days)}
                          </span>
                        </div>
                      </div>

                      {/* Postcode Rows */}
                      {isDistrictExpanded && (
                        <div className="postcodes-list">
                          {district.postcodes.map((postcode, index) => (
                            <div key={index} className="table-row postcode-row">
                              <div className="table-cell expand-col"></div>
                              <div className="table-cell name-col">
                                <span className="postcode-name">{postcode.code}</span>
                              </div>
                              <div className="table-cell assessors-col">
                                <span
                                  className="assessor-count"
                                  data-capacity={postcode.assessorCount === 4 ? 'full' : postcode.assessorCount >= 2 ? 'medium' : 'low'}
                                >
                                  {postcode.assessorCount}/4
                                </span>
                              </div>
                              <div className="table-cell districts-col">
                                -
                              </div>
                              <div className="table-cell postcodes-col">
                                -
                              </div>
                              <div className="table-cell coverage-col">
                                -
                              </div>
                              <div className="table-cell">
                                <span
                                  className="metric-value leads-count"
                                  data-priority={postcode.leadsLast30Days > 8 && postcode.assessorCount < 2 ? 'high' : ''}
                                >
                                  {postcode.leadsLast30Days} {getTrendIndicator(postcode.leadsLast30Days, postcode.leadsPrevious30Days)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {filteredCounties.length === 0 && (
        <div className="no-results">
          <h3>No coverage areas found for "{searchTerm}"</h3>
          <button
            className="clear-search-btn"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverageManagement;