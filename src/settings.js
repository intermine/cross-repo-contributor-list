/*
In order for this to work you MUST set a token. You probably want to set
an organisation and cache settings(time to live) as well to suit you.
=================================
1. Get a token.
Where do tokens come from?
See here: https://github.com/blog/1509-personal-api-tokens
=================================
2. Set env vars.
To set the vars on a Mac or Linux environment, run something like this in your terminal,
but replace everything after the = sign with your own content. No spaces allowed.

EXPORT CONTRIBUTORS_ACCESS_TOKEN=1234356647856878
EXPORT CONTRIBUTORS_ORG=yourgithuborghere
EXPORT CONTRIBUTORS_TTL=time_to_live_cache

optional - set the port this app is served on, e.g.: 
EXPORT PORT=3333
=================================
3. If the env vars aren't playing nice....
If you prefer, you _can_ set them simply by editing this file, e.g. for const token = `PUT YOUR TOKEN HERE` - but don't commit it to git, please! :)
*/

const token = process.env.CONTRIBUTORS_ACCESS_TOKEN;
const settings = {
  "organisation": process.env.CONTRIBUTORS_ORG || "Intermine",
  "access_token": "token "+token,
  "timeToLive": process.env.CONTRIBUTORS_TTL || 1296000 //15*24*60*60 ie 15 days
}

module.exports = settings;