CREATE TABLE congress (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INT NOT NULL,                 -- e.g., 116
    name VARCHAR(50) NOT NULL,           -- e.g., "116th Congress"
    start_year INT,                      -- e.g., 2019
    end_year INT,                        -- e.g., 2020
    update_date TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE congress_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    congress_id UUID REFERENCES congress (id) ON DELETE CASCADE,
    
    -- Some sessions data from the API
    session_number INT NOT NULL,            -- e.g., 1 or 2
    chamber        VARCHAR(50) NOT NULL,    -- e.g., "House of Representatives", "Senate"
    type           VARCHAR(10),            -- e.g., "R" for regular

    start_date     DATE,
    end_date       DATE,

    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE members (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- External IDs
    bioguide_id VARCHAR(20) UNIQUE NOT NULL,     -- e.g. "L000174"

    -- Names
    first_name          VARCHAR(100),            -- e.g. "Patrick"
    middle_name         VARCHAR(100),            -- if used
    last_name           VARCHAR(100),            -- e.g. "Leahy"
    honorific_name      VARCHAR(50),             -- e.g. "Mr.", "Ms.", "Dr."
    direct_order_name   VARCHAR(100),            -- e.g. "Patrick J. Leahy"
    inverted_order_name VARCHAR(100),            -- e.g. "Leahy, Patrick J."

    -- Additional
    birth_year          INT,                     -- e.g. 1940
    depiction_image_url TEXT,                    -- e.g. "https://www.congress.gov/img/member/l000174_200.jpg"
    depiction_attribution TEXT,                  -- e.g. "<a href='...'>Courtesy U.S. Senate</a>"

    update_date TIMESTAMP WITH TIME ZONE,        -- e.g. "2022-11-07T13:42:19Z"
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE member_congress (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id   UUID REFERENCES members (id) ON DELETE CASCADE,
    congress_id UUID REFERENCES congress (id) ON DELETE CASCADE,

    chamber     VARCHAR(50),  -- "Senate" or "House of Representatives"
    start_year  INT,          -- e.g. 2023
    district    INT,          -- e.g. 32 (if House)
    state       VARCHAR(100),  -- e.g. "New York"
    -- Possibly store the party as of that term if you want 
    -- or rely on partyName in the members table for "current"
    party_name  VARCHAR(100), 

    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE committees (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    congress_id uuid REFERENCES congress(id) ON DELETE CASCADE,  -- associates this committee with a specific Congress
    system_code         VARCHAR(10) UNIQUE,       -- e.g., "hspw00" or "hspw01"
    committee_type_code VARCHAR(50),              -- e.g., "Standing"
    name                VARCHAR(255) NOT NULL,
    chamber             VARCHAR(10),              -- e.g., "House", "Senate", "Joint"
    update_date         TIMESTAMP WITH TIME ZONE, -- as provided by the API
    parent_committee_id uuid REFERENCES committees(id) ON DELETE SET NULL,
    
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE committee_memberships (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    committee_id uuid REFERENCES committees(id) ON DELETE CASCADE,
    member_congress_id uuid REFERENCES member_congress(id) ON DELETE CASCADE,
    role         VARCHAR(50),       -- e.g., "Chair", "Member", etc.
    start_date   DATE,
    end_date     DATE,
    
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE (committee_id, member_congress_id)
);

CREATE TABLE bills (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    congress_id UUID NOT NULL REFERENCES congress(id) ON DELETE CASCADE,

    -- The "type" of bill: "HR", "S", "HJRes", "SJRes", etc.
    bill_type VARCHAR(20) NOT NULL,       -- e.g., 'HR'
    bill_number VARCHAR(10) NOT NULL,     -- e.g., '3076' as a string or INT

    -- Official short title, or the latest official title
    title TEXT,

    
    -- High-level status or "latest action" short text
    status TEXT,                          -- e.g., 'Became Public Law No: 117-108'
    
    -- Date bill was introduced
    introduced_date DATE,                 -- e.g., 2021-05-11
    
    -- "originChamber" from API: "House" or "Senate"
    origin_chamber VARCHAR(50),          -- e.g., "House" or "Senate"
    
    -- If it became a law, store the public law number
    public_law_number VARCHAR(20),       -- e.g., '117-108'
    
    -- Larger text fields for storing any direct text, if desired
    constitutional_authority_statement TEXT,    -- from the "constitutionalAuthorityStatementText" portion
    policy_area VARCHAR(255),                  -- e.g. "Government Operations and Politics"
    
    -- Timestamps
    update_date TIMESTAMP WITH TIME ZONE,        -- e.g., from "updateDate" field in the JSON
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bill_text_versions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id      UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    version_name VARCHAR(255),         -- e.g. "Introduced in House (IH)", "Public Print (PP)", etc.
    full_text     TEXT, 
    pdf_url       TEXT,
    date    DATE,                


    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bill_actions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id  UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,

    action_date DATE NOT NULL,
    action_text TEXT NOT NULL,     -- e.g. "Became Public Law No: 117-108."
    -- Possibly store any "type" or "category" of action if needed

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


