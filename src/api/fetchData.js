

const fetchPinnedRepos = async (username) => {
    const token = import.meta.env.VITE_SOME_KEY;
    const query = `
        query($username: String!) {
          user(login: $username) {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  languages(first: 6) {
                    nodes {
                      name
                      color
                    }
                  }
                  repositoryTopics(first: 5) {
                    nodes {
                      topic {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.user.pinnedItems.nodes;
};

const fetchLanguageAnalysis = async (username) => {
    const token = import.meta.env.VITE_SOME_KEY;
    const query = `
        query GetMostUsedLanguages($username: String!) {
          user(login: $username) {
            repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
              nodes {
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    size
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      `;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { username } }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const languageTotals = {};

    data.data.user.repositories.nodes.forEach((repo) => {
        repo.languages.edges.forEach((lang) => {
            const langName = lang.node.name;
            const langSize = lang.size;

            // Combine Jupyter Notebook and Python into a single entry
            if (langName === "Jupyter Notebook" || langName === "Python") {
                const combinedName = "Python"; // Use "Python" as the combined name
                if (languageTotals[combinedName]) {
                    languageTotals[combinedName] += langSize;
                } else {
                    languageTotals[combinedName] = langSize;
                }
            } else {
                // Handle other languages normally
                if (languageTotals[langName]) {
                    languageTotals[langName] += langSize;
                } else {
                    languageTotals[langName] = langSize;
                }
            }
        });
    });

    const sortedLanguages = Object.entries(languageTotals).sort(
        (a, b) => b[1] - a[1]
    );

    // Calculate total size for percentage calculation
    const totalSize = sortedLanguages.reduce((sum, lang) => sum + lang[1], 0);

    // Convert sizes to percentages
    const languagesWithPercentages = sortedLanguages.map((lang) => {
        return [lang[0], ((lang[1] / totalSize) * 100).toFixed(2)];
    });

    return languagesWithPercentages;
};

export { fetchLanguageAnalysis, fetchPinnedRepos };